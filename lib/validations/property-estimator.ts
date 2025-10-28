import { z } from "zod";

export const propertyEstimatorSchema = z.object({
  location: z.string().min(3, "Location is required"),
  propertyType: z.enum(["House", "Apartment", "Plot"] as const, {
    error: "Select a property type",
  }),
  area: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Enter valid area (sq ft)"
    ),
  bedrooms: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid number"),
  bathrooms: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Invalid number"),
  condition: z.enum(
    ["Excellent", "Good", "Average", "Needs Renovation"] as const,
    {
      error: "Select property condition",
    }
  ),
});

export type PropertyEstimatorValues = z.infer<typeof propertyEstimatorSchema>;
