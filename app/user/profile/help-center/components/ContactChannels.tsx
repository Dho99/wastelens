import React from "react";

interface ContactChannelsProps {
  whatsappHours: string;
  emailResponseTime: string;
  onLiveChatClick?: () => void;
  onWhatsappClick?: () => void;
  onEmailClick?: () => void;
}

export const ContactChannels: React.FC<ContactChannelsProps> = ({
  whatsappHours,
  emailResponseTime,
  onLiveChatClick,
  onWhatsappClick,
  onEmailClick,
}) => {
  return (
    <div className="px-4 mb-8">
      <div className="bg-[#FAF9F5] border border-gray-150/40 rounded-[32px] p-5 shadow-sm space-y-4">
        
        {/* Header Text details */}
        <div className="flex flex-col gap-0.5 select-none px-1">
          <h4 className="text-sm font-extrabold text-gray-900 tracking-tight">
            Masih Butuh Bantuan?
          </h4>
          <p className="text-[11px] text-gray-400 font-bold leading-normal">
            Hubungi tim kurator kami yang ramah lingkungan.
          </p>
        </div>

        {/* 1. Live Chat Button */}
        <button
          onClick={onLiveChatClick}
          className="w-full bg-[#0D631B] hover:bg-[#0a4d15] active:scale-[0.98] text-white rounded-2xl p-4 flex items-center justify-between shadow-sm transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            {/* MDI message-outline */}
            <svg className="w-5.5 h-5.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-xs font-black">
              Live Chat (Respons Cepat)
            </span>
          </div>

          {/* ONLINE Badge */}
          <span className="bg-white/10 text-white font-black text-[8px] px-2 py-0.5 rounded uppercase tracking-wide">
            ONLINE
          </span>
        </button>

        {/* 2 & 3. WhatsApp & Email 2-column Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* WhatsApp Card */}
          <div
            onClick={onWhatsappClick}
            className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col items-center text-center cursor-pointer hover:scale-[1.01] active:scale-98 transition-all duration-200 shadow-sm"
          >
            {/* WhatsApp logo/chat icon in green */}
            <div className="text-[#25D366] mb-2 flex-shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2zm0 1.66c2.2 0 4.27.86 5.82 2.41 1.55 1.55 2.41 3.63 2.41 5.84 0 4.55-3.7 8.25-8.25 8.25-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32C4.19 14.9 3.79 13.5 3.79 12c0-4.55 3.7-8.25 8.25-8.25z" />
              </svg>
            </div>
            <h5 className="text-xs font-black text-gray-800">
              WhatsApp
            </h5>
            <span className="text-[10px] text-gray-400 font-extrabold mt-0.5">
              {whatsappHours}
            </span>
          </div>

          {/* Email Card */}
          <div
            onClick={onEmailClick}
            className="bg-white border border-gray-100 rounded-3xl p-4 flex flex-col items-center text-center cursor-pointer hover:scale-[1.01] active:scale-98 transition-all duration-200 shadow-sm"
          >
            {/* Mail icon in green */}
            <div className="text-[#1E7D38] mb-2 flex-shrink-0">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22,6C22,4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
              </svg>
            </div>
            <h5 className="text-xs font-black text-gray-800">
              Email
            </h5>
            <span className="text-[10px] text-gray-400 font-extrabold mt-0.5">
              {emailResponseTime}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
