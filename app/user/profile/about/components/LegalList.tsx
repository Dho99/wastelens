import React from "react";

interface LegalListProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
}

export const LegalList: React.FC<LegalListProps> = ({
  onTermsClick,
  onPrivacyClick,
}) => {
  return (
    <div className="px-4 mb-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-3 shadow-sm divide-y divide-gray-50">
        
        {/* Syarat & Ketentuan */}
        <div
          onClick={onTermsClick}
          className="flex items-center justify-between py-3.5 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
        >
          <div className="flex items-center gap-3.5 pl-1">
            {/* Gavel icon container in soft red/brown background */}
            <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#C55D2D] flex items-center justify-center shadow-sm flex-shrink-0">
              {/* MDI gavel */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.14,12.94L20.56,11.5L21.97,12.9L16.32,18.56L14.9,17.15L16.32,15.73L13.41,12.82L9.21,17.03C8.42,17.81 7.15,17.81 6.37,17.03L3,13.66C2.22,12.88 2.22,11.61 3,10.82L7.22,6.61L4.31,3.7L5.73,2.29L21.27,17.83L19.86,19.24L19.14,17.53M9,13.5C9,14.05 9.45,14.5 10,14.5A1,1 0 0,0 11,13.5C11,12.95 10.55,12.5 10,12.5A1,1 0 0,0 9,13.5Z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-805">
              Syarat &amp; Ketentuan
            </span>
          </div>

          <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </div>

        {/* Kebijakan Privasi */}
        <div
          onClick={onPrivacyClick}
          className="flex items-center justify-between py-3.5 px-2 cursor-pointer hover:bg-gray-50/50 transition-colors select-none"
        >
          <div className="flex items-center gap-3.5 pl-1">
            {/* Shield Check icon container in soft red/brown background */}
            <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#C55D2D] flex items-center justify-center shadow-sm flex-shrink-0">
              {/* MDI shield-check-outline */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12,2L19,5V11C19,16.2 15.6,21 12,22.2C8.4,21 5,16.2 5,11V5L12,2M12,4.2L7,6.3V11C7,15.1 9.8,19 12,20.1C14.2,19 17,15.1 17,11V6.3L12,4.2M11,15L7.5,11.5L8.9,10.1L11,12.2L15.1,8.1L16.5,9.5L11,15Z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-850">
              Kebijakan Privasi
            </span>
          </div>

          <svg className="w-5 h-5 text-gray-400 fill-current" viewBox="0 0 24 24">
            <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </svg>
        </div>

      </div>
    </div>
  );
};
