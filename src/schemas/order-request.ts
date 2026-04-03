import { z } from "zod";

const nonNegative = z.number().int().min(0);

export const orderRequestSchema = z.object({
  quantity: z.number().int().min(12, "Minimum recommended quantity is 12"),
  sizeBreakdown: z.object({
    xs: nonNegative,
    s: nonNegative,
    m: nonNegative,
    l: nonNegative,
    xl: nonNegative,
    xxl: nonNegative,
  }),
  fitSplit: z.object({
    male: nonNegative,
    female: nonNegative,
  }),
  notes: z.string().min(10, "Add a few production notes so the team has context"),
  deadline: z.string().min(1, "Select a target deadline"),
  customerName: z.string().min(2, "Enter the contact name"),
  companyName: z.string().min(2, "Enter the company, campus, or group name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export type OrderRequestFormValues = z.infer<typeof orderRequestSchema>;
