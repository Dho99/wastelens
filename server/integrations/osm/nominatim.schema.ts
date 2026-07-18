import { z } from "zod";

const addressDetailsSchema = z.object({
  road: z.string().optional(),
  suburb: z.string().optional(),
  city_district: z.string().optional(),
  neighbourhood: z.string().optional(),
  village: z.string().optional(),
  town: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const nominatimResponseSchema = z.object({
  display_name: z.string().optional(),
  address: addressDetailsSchema.optional(),
});
