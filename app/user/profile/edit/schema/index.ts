import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export type EditProfileData = z.infer<typeof editProfileSchema>;
