import React from "react";

export const ProtectCard: React.FC = () => {
  return (
    <div className="px-4 mb-6 select-none">
      <div className="bg-[#E2ECE4]/70 border border-[#cedbd1]/60 rounded-3xl p-8 flex flex-col items-center justify-center shadow-sm">
        
        {/* Circle Shield wrapper */}
        <div className="w-16 h-16 rounded-full bg-[#287A38] text-white flex items-center justify-center shadow-md mb-3">
          {/* MDI shield */}
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12,2L19,5V11C19,16.2 15.6,21 12,22.2C8.4,21 5,16.2 5,11V5L12,2Z" />
          </svg>
        </div>

        <h2 className="text-xl font-black text-[#0D631B] tracking-tight leading-none">
          Lindungi Akun Anda
        </h2>

      </div>
    </div>
  );
};
