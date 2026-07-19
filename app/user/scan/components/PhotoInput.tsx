"use client";

import { useRef, type ChangeEvent } from "react";
import { Camera } from "lucide-react";

type Props = {
  onPhotoSelected: (base64: string, file: File, mimeType: string) => void;
  onError: (message: string) => void;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function PhotoInput({ onPhotoSelected, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      onError("Format foto harus JPEG, PNG, atau WebP");
      return;
    }

    if (file.size > MAX_SIZE) {
      onError("Ukuran foto maksimal 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onPhotoSelected(reader.result as string, file, file.type);
    };
    reader.onerror = () => onError("Gagal membaca file");
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onClick={() => inputRef.current?.click()}
        className="w-40 h-40 rounded-3xl bg-[#E2ECE4] border-2 border-dashed border-[#287A38] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#d4e6d8] active:scale-95 transition-all"
      >
        <Camera className="w-10 h-10 text-[#287A38]" />
        <span className="text-xs font-bold text-[#287A38] text-center leading-tight px-2">
          Ambil atau Pilih Foto
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-xs text-gray-400 font-semibold text-center max-w-[260px]">
        JPEG, PNG, atau WebP. Maksimal 5 MB.
      </p>
    </div>
  );
}
