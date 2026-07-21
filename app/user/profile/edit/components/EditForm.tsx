import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { EditProfileData } from "../schema";

interface EditFormProps {
    register: UseFormRegister<EditProfileData>;
    errors: FieldErrors<EditProfileData>;
}

export const EditForm: React.FC<EditFormProps> = ({ register, errors }) => {
    return (
        <div className="px-4 mb-5 space-y-4">
            {/* 1. Nama Lengkap */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
                    NAMA LENGKAP
                </label>
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                        <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        {...register("name")}
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
                    />
                </div>
                {errors.name && (
                    <p className="text-[10px] font-bold text-red-500 px-1">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* 2. Alamat Email */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
                    ALAMAT EMAIL
                </label>
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                        <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6M20 6L12 11L4 6H20M20 18H4V8L12 13L20 8V18Z" />
                        </svg>
                    </span>
                    <input
                        type="email"
                        {...register("email")}
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
                    />
                </div>
                {errors.email && (
                    <p className="text-[10px] font-bold text-red-500 px-1">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* 3. Nomor Telepon */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
                    NOMOR TELEPON
                </label>
                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                        <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9C16.1,14.8 15.7,14.9 15.5,15.1L13.3,17.3C10.5,15.9 8.1,13.5 6.7,10.7L8.9,8.5C9.1,8.3 9.2,7.9 9.1,7.6C8.7,6.5 8.5,5.2 8.5,4C8.5,2.9 7.6,2 6.5,2H3C1.9,2 1,2.9 1,4C1,13.9 9.1,22 19,22C20.1,22 21,21.1 21,20V16.5C21,15.4 20.1,15.5 19,15.5M5,4H6.5C6.7,5.5 7,6.9 7.4,8.2L5.8,9.8C5.2,7.9 5,5.9 5,4M20,19C20,19 18,18.8 16.2,18.2L17.8,16.6C19.1,17 20.5,17.3 20,19Z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        {...register("phoneNumber")}
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold text-gray-805 shadow-sm"
                    />
                </div>
                {errors.phoneNumber && (
                    <p className="text-[10px] font-bold text-red-500 px-1">
                        {errors.phoneNumber.message}
                    </p>
                )}
            </div>

            {/* 4. Alamat Tinggal */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-gray-400 tracking-wider uppercase px-1">
                    ALAMAT TINGGAL
                </label>
                <div className="relative w-full">
                    <span className="absolute top-4 left-4 flex items-center text-gray-500">
                        <svg
                            className="w-5 h-5 fill-current"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z" />
                        </svg>
                    </span>
                    <textarea
                        {...register("address")}
                        rows={3}
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-12 pr-4 py-3.5 text-xs font-semibold text-gray-850 shadow-sm leading-relaxed"
                    />
                </div>
                {errors.address && (
                    <p className="text-[10px] font-bold text-red-500 px-1">
                        {errors.address.message}
                    </p>
                )}
            </div>
        </div>
    );
};
