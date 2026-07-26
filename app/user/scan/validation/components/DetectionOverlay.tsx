import Image from "next/image";
import React from "react";

export const DetectionOverlay: React.FC = () => {
  const [photoUrl, setPhotoUrl] = React.useState("https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80");

  React.useEffect(() => {
    const saved = localStorage.getItem("captured_image");
    if (saved) {
      setPhotoUrl(saved);
    }
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-gray-100 shadow-inner">
      <Image
        src={photoUrl}
        alt="Littered pavement"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Viewfinder corner notches matching the camera box overlay */}
      <div className="absolute inset-4 border border-dashed border-white/30 rounded-2xl pointer-events-none">
        <div className="absolute top-[-2px] left-[-2px] w-6 h-6 border-t-2 border-l-2 border-[#287A38] rounded-tl-lg" />
        <div className="absolute top-[-2px] right-[-2px] w-6 h-6 border-t-2 border-r-2 border-[#287A38] rounded-tr-lg" />
        <div className="absolute bottom-[-2px] left-[-2px] w-6 h-6 border-b-2 border-l-2 border-[#287A38] rounded-bl-lg" />
        <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 border-b-2 border-r-2 border-[#287A38] rounded-br-lg" />
      </div>

      {/* Floating Glassmorphic AI Box */}
      <div className="absolute top-6 left-6 right-6 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-4 shadow-xl flex gap-3.5 items-start">
        {/* Shield Icon container */}
        <div className="w-10 h-10 rounded-xl bg-white/90 border border-white flex items-center justify-center shadow-sm flex-shrink-0 text-[#1E7D38]">
          {/* MDI shield-outline */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12,12H19C18.47,15.7 15.82,18.83 12,19.78V12H5V6.3L12,3.19V12M12,2L4,5.5V11C4,16.55 7.42,21.74 12,23C16.58,21.74 20,16.55 20,11V5.5L12,2Z" />
          </svg>
        </div>

        {/* AI validation text logs */}
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black text-slate-800 tracking-tight">
            AI Analysis: Object Detection
          </h4>
          <p className="text-[10px] text-slate-700 font-bold mt-0.5 flex items-center gap-1.5">
            {/* Spinning/pulsing dot */}
            <span className="w-2 h-2 rounded-full bg-[#287A38] animate-ping flex-shrink-0" />
            <span>Validating Scene...</span>
          </p>
          {/* Progress bar inside popup */}
          <div className="w-full h-1 bg-slate-300/40 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-[#287A38] rounded-full w-2/3 animate-[pulse_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Trash bounding box overlays */}
      {/* Bounding box 1: Litter */}
      <div className="absolute left-[20%] top-[55%] border border-dashed border-white/60 px-3 py-1.5 rounded-lg flex flex-col items-center">
        <span className="bg-black/40 backdrop-blur-[1px] text-[8px] font-black text-white px-2 py-0.5 rounded tracking-wide uppercase">
          Litter
        </span>
      </div>

      {/* Bounding box 2: Plastic */}
      <div className="absolute right-[25%] top-[45%] border border-dashed border-white/60 px-3 py-1.5 rounded-lg flex flex-col items-center">
        <span className="bg-[#287A38]/70 backdrop-blur-[1px] text-[8px] font-black text-white px-2 py-0.5 rounded tracking-wide uppercase">
          Plastic
        </span>
      </div>
    </div>
  );
};
