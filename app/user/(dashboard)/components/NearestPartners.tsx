import React from "react";
import { NearestPartner } from "../../services/dashboardService";

interface NearestPartnersProps {
  partners: NearestPartner[];
  onPartnerClick?: (partnerId: string) => void;
}

export const NearestPartners: React.FC<NearestPartnersProps> = ({
  partners,
  onPartnerClick,
}) => {
  return (
    <div className="px-5 mb-6">
      <h2 className="text-sm font-extrabold text-gray-900 tracking-wide mb-3">
        Tukar di Mitra Terdekat
      </h2>

      <div className="space-y-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white border border-gray-100/80 rounded-3xl overflow-hidden shadow-sm flex flex-col"
          >
            {/* Store Image Header with overlay tag */}
            <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={partner.imageUrl}
                alt={partner.name}
                className="w-full h-full object-cover"
              />

              {/* Distance Tag */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full py-1.5 px-3 flex items-center gap-1.5 shadow-sm">
                <span className="text-red-500">
                  <svg
                    className="w-3.5 h-3.5 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <span className="text-[10px] font-black text-gray-700">
                  {partner.distance}
                </span>
              </div>
            </div>

            {/* Details Footer */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h4 className="text-sm font-black text-gray-800">
                  {partner.name}
                </h4>
                <p className="text-xs text-gray-400 font-medium">
                  {partner.description}
                </p>
              </div>

              {/* Direction Action Circle */}
              <button
                onClick={() => onPartnerClick?.(partner.id)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#ECF3ED] hover:bg-[#dce9de] transition-colors active:scale-95 text-[#1E7D38]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
