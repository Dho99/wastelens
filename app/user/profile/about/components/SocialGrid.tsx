import React from "react";

interface SocialGridProps {
  onLinkClick: (channel: string) => void;
}

export const SocialGrid: React.FC<SocialGridProps> = ({ onLinkClick }) => {
  const channels = [
    {
      id: "web",
      icon: (
        <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,13.09 19.78,14.13 19.38,15.09L15.38,11.09A1,1 0 0,0 14,11.09V11A1,1 0 0,0 13,10H9A1,1 0 0,0 8,11V13A1,1 0 0,0 9,14H10.5L11,15.5A1,1 0 0,0 12,16H13.5V17.5A1,1 0 0,0 14.5,18.5L14.73,18.73C13.88,19.5 12.8,20 11.5,20C10.74,20 10.03,19.8 9.39,19.46L9.62,18.31C9.72,17.77 9.53,17.21 9.14,16.82L7.32,15C7.11,14.79 7,14.5 7,14.21V12.71C7,12.17 6.82,11.66 6.5,11.24L6.11,10.74C6.04,10.65 6,10.54 6,10.42V9.42C6,8.88 6.44,8.44 6.98,8.44H8.48A1,1 0 0,0 9.48,7.44V6.44C9.48,5.9 9.92,5.46 10.46,5.46H11.5A1,1 0 0,0 12.5,4.46V4Z" />
        </svg>
      )
    },
    {
      id: "email",
      icon: (
        <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
          <path d="M22,6C22,4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
        </svg>
      )
    },
    {
      id: "podcast",
      icon: (
        <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12C6,14.31 7.3,16.32 9.22,17.32L10.22,15.7C8.84,15 8,13.61 8,12A4,4 0 0,1 12,8A4,4 0 0,1 16,12C16,13.61 15.16,15 13.78,15.7L14.78,17.32C16.7,16.32 18,14.31 18,12A6,6 0 0,0 12,6M12,10A2,2 0 0,0 10,12C10,12.83 10.5,13.5 11.25,13.82L10,20H14L12.75,13.82C13.5,13.5 14,12.83 14,12A2,2 0 0,0 12,10Z" />
        </svg>
      )
    },
    {
      id: "share",
      icon: (
        <svg className="w-5.5 h-5.5 fill-current" viewBox="0 0 24 24">
          <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.13,18.77 15.13,19A3,3 0 0,0 18.13,22A3,3 0 0,0 21.13,19A3,3 0 0,0 18.13,16.08" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col items-center select-none mb-8">
      {/* Header title */}
      <h3 className="text-[9.5px] font-black text-gray-405 tracking-widest uppercase mb-3.5">
        HUBUNGI KAMI
      </h3>

      {/* Grid flex row */}
      <div className="flex gap-4">
        {channels.map((chan) => (
          <button
            key={chan.id}
            onClick={() => onLinkClick(chan.id)}
            className="w-11 h-11 rounded-full bg-[#E2ECE4]/70 text-[#1E7D38] hover:bg-[#d2ebd6] active:scale-90 flex items-center justify-center shadow-sm transition-all duration-200"
            aria-label={`Contact via ${chan.id}`}
          >
            {chan.icon}
          </button>
        ))}
      </div>
    </div>
  );
};
