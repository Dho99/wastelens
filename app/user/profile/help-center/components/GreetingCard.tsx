import React from "react";

export const GreetingCard: React.FC = () => {
  return (
    <div className="px-4 mb-5 select-none">
      <div className="bg-[#DCE6DE] border border-[#cedbd1]/60 rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-bold text-[#1E7D38]/85">
          Halo! Ada yang bisa kami bantu?
        </p>
        <h2 className="text-xl font-black text-[#0D631B] tracking-tight mt-1 leading-none">
          Pusat Bantuan WasteLens
        </h2>
      </div>
    </div>
  );
};
