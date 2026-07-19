import React from "react";

interface ViewfinderProps {
  children?: React.ReactNode;
}

export const Viewfinder: React.FC<ViewfinderProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 z-10 w-full h-full overflow-hidden pointer-events-none">
      {children}

      {/* Frame overlay */}
      <div className="absolute inset-x-5 top-28 bottom-48 flex items-center justify-center">
        {/* Bounding box */}
        <div className="relative w-full h-full border-2 border-dashed border-white/60 rounded-[32px] flex flex-col justify-between items-center p-6">
          
          {/* Custom Solid Green Corner Notches */}
          {/* Top-Left */}
          <div className="absolute top-[-3px] left-[-3px] w-8 h-8 border-t-4 border-l-4 border-[#287A38] rounded-tl-2xl" />
          {/* Top-Right */}
          <div className="absolute top-[-3px] right-[-3px] w-8 h-8 border-t-4 border-r-4 border-[#287A38] rounded-tr-2xl" />
          {/* Bottom-Left */}
          <div className="absolute bottom-[-3px] left-[-3px] w-8 h-8 border-b-4 border-l-4 border-[#287A38] rounded-bl-2xl" />
          {/* Bottom-Right */}
          <div className="absolute bottom-[-3px] right-[-3px] w-8 h-8 border-b-4 border-r-4 border-[#287A38] rounded-br-2xl" />

          {/* DETEKSI SAMPAH Floating Badge */}
          <div className="absolute -top-4 bg-[#287A38] text-white text-[10px] font-black px-4.5 py-2.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 z-20">
            {/* MDI Scanner / Document box icon */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19,16A3,3 0 0,1 16,19H8A3,3 0 0,1 5,16V9A3,3 0 0,1 8,6H16A3,3 0 0,1 19,9V16M16,4H8A5,5 0 0,0 3,9V16A5,5 0 0,0 8,21H16A5,5 0 0,0 21,16V9A5,5 0 0,0 16,4M16,11H8V9H16V11M16,15H8V13H16V15Z" />
            </svg>
            <span>DETEKSI SAMPAH</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Guide Notification inside Viewfinder */}
          <div className="w-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold text-center p-4 rounded-2xl shadow-lg border border-white/10 z-20 leading-relaxed max-w-[320px]">
            Pastikan tumpukan sampah terlihat jelas dan tidak tertutup objek lain.
          </div>
        </div>
      </div>
    </div>
  );
};
