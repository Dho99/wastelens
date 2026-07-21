import React from "react";

export const EncryptionNotice: React.FC = () => {
  return (
    <div className="px-4 mb-6">
      <div className="bg-[#FCECE8] border border-[#F5C2C1] rounded-[28px] p-5 flex gap-4 select-none">
        
        {/* Info circle MDI icon in dark red */}
        <div className="text-[#A83232] flex-shrink-0 mt-0.5">
          <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z" />
          </svg>
        </div>

        {/* Text statement */}
        <p className="text-[11px] font-bold text-[#A83232]/85 leading-relaxed text-left">
          Kami menggunakan enkripsi tingkat lanjut untuk melindungi data pengelolaan limbah Anda. Pastikan untuk memperbarui kata sandi secara berkala.
        </p>

      </div>
    </div>
  );
};
