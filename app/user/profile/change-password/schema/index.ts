import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi"),
    newPassword: z
      .string()
      .min(8, "Minimal 8 karakter")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)/,
        "Harus mengandung huruf dan angka",
      ),
    confirmPassword: z.string().min(1, "Konfirmasi wajib diisi"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Konfirmasi kata sandi tidak sesuai",
    path: ["confirmPassword"],
  });

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
