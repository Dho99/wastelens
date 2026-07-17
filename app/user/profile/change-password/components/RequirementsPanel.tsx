import React from "react";
import { PasswordValidationRules } from "../services/passwordService";

interface RequirementsPanelProps {
  validations: PasswordValidationRules;
}

export const RequirementsPanel: React.FC<RequirementsPanelProps> = ({
  validations,
}) => {
  const reqs = [
    { label: "Minimal 8 karakter", valid: validations.minLength },
    { label: "Campuran huruf dan angka", valid: validations.containsMixed },
    {
      label: "Konfirmasi sesuai dengan kata sandi baru",
      valid: validations.matchesConfirm,
    },
  ];

  return (
    <div className="px-4 mb-8">
      <div className="bg-[#FAF9F5] border border-gray-150/40 rounded-3xl p-5 shadow-sm space-y-3.5 select-none">
        <h4 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-1">
          SYARAT KATA SANDI:
        </h4>

        {reqs.map((req, idx) => {
          const iconColor = req.valid ? "text-[#248A3D]" : "text-gray-300";
          const textColor = req.valid ? "text-gray-800" : "text-gray-400";

          return (
            <div key={idx} className="flex items-center gap-3.5">
              {/* MDI check-circle-outline */}
              <svg className={`w-5 h-5 fill-current flex-shrink-0 ${iconColor} transition-colors duration-200`} viewBox="0 0 24 24">
                <path d="M12,20A8,8 0 1,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 1,0 22,12A10,10 0 0,0 12,2M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
              <span className={`text-xs font-bold transition-colors duration-200 ${textColor}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
