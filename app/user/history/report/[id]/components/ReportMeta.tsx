import React from "react";

interface ReportMetaProps {
  locationTitle: string;
  locationDetails: string;
  fullAddress?: string | null;
  reportTime: string;
  wasteTypes: string[];
}

export const ReportMeta: React.FC<ReportMetaProps> = ({
  locationTitle,
  locationDetails,
  fullAddress,
  reportTime,
  wasteTypes,
}) => {
  return (
    <div className="px-4 mb-5">
      <div className="bg-[#FAF9F5] border border-gray-100/80 rounded-3xl p-5 shadow-sm space-y-5">
        {/* Row 1: Titik Lokasi */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
            {/* MDI map-marker-outline */}
            <svg className="w-5 h-5 text-[#287A38]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              TITIK LOKASI
            </span>
            <h4 className="text-sm font-extrabold text-gray-800 truncate">
              {locationTitle}
            </h4>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              {locationDetails}
            </p>
          </div>
        </div>

        {/* Row 1b: Alamat Lengkap */}
        {fullAddress && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-[#287A38]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
                ALAMAT LENGKAP
              </span>
              <p className="text-sm font-extrabold text-gray-800 leading-relaxed">
                {fullAddress}
              </p>
            </div>
          </div>
        )}

        {/* Row 2: Waktu Laporan */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
            {/* MDI calendar-outline */}
            <svg className="w-5 h-5 text-[#287A38]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 19H5V8H19M16 1V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V5C21 3.89 20.1 3 19 3H18V1M17 12H12V17H17V12Z" />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              WAKTU LAPORAN
            </span>
            <h4 className="text-sm font-extrabold text-gray-800">
              {reportTime}
            </h4>
          </div>
        </div>

        {/* Row 3: Jenis Sampah */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm flex-shrink-0">
            {/* MDI recycle */}
            <svg className="w-5 h-5 text-[#287A38]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-black text-gray-400 tracking-wider uppercase">
              JENIS SAMPAH
            </span>
            <div className="flex flex-wrap gap-2">
              {wasteTypes.map((type) => (
                <span
                  key={type}
                  className="bg-[#FDF3EA] text-[#A05C2C] text-xs font-bold px-3.5 py-1 rounded-full border border-[#f5e3d3]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
