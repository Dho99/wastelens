import React, { useState } from "react";

interface PasswordFormProps {
  currentPass: string;
  newPass: string;
  confirmPass: string;
  onCurrentChange: (val: string) => void;
  onNewChange: (val: string) => void;
  onConfirmChange: (val: string) => void;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  currentPass,
  newPass,
  confirmPass,
  onCurrentChange,
  onNewChange,
  onConfirmChange,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // SVG eye paths
  const eyeOpen = (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17Z" />
    </svg>
  );

  const eyeClosed = (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M2,12C3.18,9 5.3,6.64 8,5.43L9.58,7C7.88,8.21 6.56,9.97 5.82,12C7.56,16 11.43,18 12,18C12.44,18 13.6,17.7 14.73,17.15L16.27,18.69C15,19.24 13.5,19.5 12,19.5C7,19.5 2.73,16.39 2,12Z M12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14" />
    </svg>
  );

  return (
    <div className="px-4 mb-5 space-y-4">
      <p className="text-xs text-gray-500 font-semibold leading-relaxed mb-4 px-1">
        Pastikan kata sandi baru Anda kuat dan belum pernah digunakan di layanan lain sebelumnya.
      </p>

      {/* 1. Kata Sandi Saat Ini */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
          Kata Sandi Saat Ini
        </label>
        <div className="relative w-full">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPass}
            onChange={(e) => onCurrentChange(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-4 pr-12 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showCurrent ? eyeClosed : eyeOpen}
          </button>
        </div>
      </div>

      {/* 2. Kata Sandi Baru */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
          Kata Sandi Baru
        </label>
        <div className="relative w-full">
          <input
            type={showNew ? "text" : "password"}
            value={newPass}
            onChange={(e) => onNewChange(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-4 pr-12 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showNew ? eyeClosed : eyeOpen}
          </button>
        </div>
      </div>

      {/* 3. Konfirmasi Kata Sandi Baru */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
          Konfirmasi Kata Sandi Baru
        </label>
        <div className="relative w-full">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPass}
            onChange={(e) => onConfirmChange(e.target.value)}
            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-4 pr-12 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirm ? eyeClosed : eyeOpen}
          </button>
        </div>
      </div>

    </div>
  );
};
