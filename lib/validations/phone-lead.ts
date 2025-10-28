import { z } from "zod";

export const phoneLeadSchema = z.object({
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Only digits and symbols (+, -, ()) are allowed"),
});

export type PhoneLeadValues = z.infer<typeof phoneLeadSchema>;
