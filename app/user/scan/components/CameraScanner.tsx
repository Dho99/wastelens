"use client";

import { useRef, useEffect, useCallback, useState, useImperativeHandle, forwardRef } from "react";

type Props = {
  onCapture: (result: { file: File; previewUrl: string }) => void;
  onError: (message: string) => void;
  onCameraReady?: () => void;
  facingMode?: "environment" | "user";
};

export type CameraScannerHandle = {
  capture: () => void;
  stopStream: () => void;
};

type CameraState = "IDLE" | "REQUESTING" | "READY" | "ERROR";

function isCamDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "production") return true;
  return new URLSearchParams(window.location.search).get("debugCam") === "1";
}

function camDebug(...args: unknown[]) {
  if (isCamDebugEnabled()) {
    console.info("[CameraScanner]", ...args);
  }
}

function waitForLoadedMetadata(
  video: HTMLVideoElement,
  isAborted: () => boolean,
): Promise<void> {
  if (video.readyState >= 1 && video.videoWidth > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Gagal memuat metadata video"));
    };
    const onAbortCheck = () => {
      if (isAborted()) {
        cleanup();
        reject(new DOMException("The operation was aborted.", "AbortError"));
      }
    };
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("error", onError);
      clearInterval(intervalId);
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("error", onError);
    const intervalId = setInterval(onAbortCheck, 50);
    onAbortCheck();
  });
}

export const CameraScanner = forwardRef<CameraScannerHandle, Props>(
  function CameraScanner({ onCapture, onError, onCameraReady, facingMode = "environment" }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef(0);

  const onCaptureRef = useRef(onCapture);
  const onErrorRef = useRef(onError);
  const onCameraReadyRef = useRef(onCameraReady);

  const [cameraState, setCameraState] = useState<CameraState>("IDLE");

  useEffect(() => {
    onCaptureRef.current = onCapture;
    onErrorRef.current = onError;
    onCameraReadyRef.current = onCameraReady;
  });

  const stopStream = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          onErrorRef.current("Gagal memproses gambar");
          return;
        }
        const file = new File([blob], "capture.jpeg", { type: "image/jpeg" });
        const previewUrl = URL.createObjectURL(file);
        onCaptureRef.current({ file, previewUrl });
      },
      "image/jpeg",
      0.92,
    );
  }, []);

  useImperativeHandle(ref, () => ({ capture, stopStream }), [capture, stopStream]);

  useEffect(() => {
    const session = ++sessionRef.current;
    let cancelled = false;

    const isCurrent = () => !cancelled && session === sessionRef.current;

    setCameraState("REQUESTING");

    camDebug("start", {
      session,
      isSecureContext: window.isSecureContext,
      mediaDevices: !!navigator.mediaDevices,
      facingMode,
    });

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Kamera tidak tersedia");
        }

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          if (!isCurrent()) {
            camDebug("superseded after enumerateDevices", { session });
            return;
          }
          camDebug(
            "enumerateDevices",
            { session },
            devices.map((d) => ({
              kind: d.kind,
              label: d.label || "(empty)",
              deviceId: d.deviceId ? `${d.deviceId.slice(0, 8)}…` : "",
            })),
          );
        } catch (enumErr) {
          camDebug("enumerateDevices failed", { session }, enumErr);
        }

        let stream: MediaStream;

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode },
            audio: false,
          });
          camDebug("getUserMedia ok", { session, constraint: "facingMode", facingMode });
        } catch (primaryErr) {
          if (!isCurrent()) {
            camDebug("superseded after facingMode failure", { session });
            return;
          }
          camDebug("getUserMedia facingMode failed, falling back to { video: true }", {
            session,
            name: primaryErr instanceof DOMException ? primaryErr.name : undefined,
            message: primaryErr instanceof Error ? primaryErr.message : String(primaryErr),
          });
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false,
            });
            camDebug("getUserMedia ok", { session, constraint: "video: true" });
          } catch {
            throw primaryErr instanceof Error
              ? primaryErr
              : new Error("Kamera tidak tersedia");
          }
        }

        if (!isCurrent()) {
          camDebug("superseded after getUserMedia", { session });
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const tracks = stream.getVideoTracks();
        camDebug(
          "stream tracks",
          { session },
          tracks.map((t) => ({
            label: t.label,
            readyState: t.readyState,
            enabled: t.enabled,
            muted: t.muted,
          })),
        );

        // Clear any previous stream before binding the new one
        stopStream();
        if (!isCurrent()) {
          camDebug("superseded after clearing previous stream", { session });
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = videoRef.current;
        camDebug("before bind", {
          session,
          hasVideoEl: !!video,
          srcObject: video?.srcObject ?? null,
        });

        if (!video) {
          stream.getTracks().forEach((t) => t.stop());
          throw new Error("Elemen video tidak siap");
        }

        streamRef.current = stream;
        video.srcObject = stream;

        if (!isCurrent()) {
          camDebug("superseded after bind", { session });
          stream.getTracks().forEach((t) => t.stop());
          if (streamRef.current === stream) streamRef.current = null;
          if (video.srcObject === stream) video.srcObject = null;
          return;
        }

        await waitForLoadedMetadata(video, () => !isCurrent());
        if (!isCurrent()) {
          camDebug("superseded after loadedmetadata", { session });
          return;
        }

        camDebug("loadedmetadata", {
          session,
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          trackReadyState: stream.getVideoTracks()[0]?.readyState,
          trackEnabled: stream.getVideoTracks()[0]?.enabled,
        });

        try {
          await video.play();
        } catch (playErr) {
          if (!isCurrent()) {
            camDebug("superseded during play", { session }, playErr);
            return;
          }
          const isAbort =
            playErr instanceof DOMException && playErr.name === "AbortError";
          if (isAbort) {
            camDebug("video.play() AbortError, retrying once", { session });
            await new Promise((r) => setTimeout(r, 50));
            if (!isCurrent()) return;
            try {
              await video.play();
            } catch (retryErr) {
              if (!isCurrent()) return;
              // Non-fatal if video is already playing / has frames
              if (video.paused && video.readyState < 2) {
                throw retryErr instanceof Error
                  ? retryErr
                  : new Error("Gagal memutar video kamera");
              }
              camDebug("play retry failed but video has data", { session }, retryErr);
            }
          } else if (video.paused && video.readyState < 2) {
            throw playErr instanceof Error
              ? playErr
              : new Error("Gagal memutar video kamera");
          } else {
            camDebug("video.play() rejected but video has data", { session }, playErr);
          }
        }

        if (!isCurrent()) {
          camDebug("superseded after play", { session });
          return;
        }

        camDebug("after bind", {
          session,
          srcObject: !!video.srcObject,
          readyState: video.readyState,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight,
          paused: video.paused,
        });

        setCameraState("READY");
        onCameraReadyRef.current?.();
      } catch (err) {
        if (!isCurrent()) {
          camDebug("superseded on error path", { session });
          return;
        }

        camDebug("error", {
          session,
          name: err instanceof DOMException ? err.name : err instanceof Error ? err.name : undefined,
          message: err instanceof Error ? err.message : String(err),
        });

        const message =
          err instanceof DOMException && err.name === "NotAllowedError"
            ? "Izin kamera ditolak. Buka pengaturan browser untuk mengizinkan akses kamera."
            : err instanceof Error
              ? err.message
              : "Gagal membuka kamera";
        setCameraState("ERROR");
        onErrorRef.current(message);
      }
    })();

    return () => {
      cancelled = true;
      // Invalidate any in-flight async work from this or prior sessions
      sessionRef.current += 1;
      camDebug("cleanup invalidate", { endedSession: session, nextSession: sessionRef.current });
      stopStream();
    };
  }, [facingMode, stopStream]);

  if (cameraState === "ERROR") {
    return null;
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      {(cameraState === "IDLE" || cameraState === "REQUESTING") && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white/70 text-sm font-semibold">Mengakses kamera...</p>
          </div>
        </div>
      )}
    </>
  );
});
