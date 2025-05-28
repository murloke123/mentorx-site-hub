import * as z from "zod";

// Define the schema for the form validation
export const formSchema = z.object({
  name: z.string().min(5, "O título deve conter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve conter pelo menos 20 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  image: z.string().min(1, "Selecione uma imagem para o curso"),
  type: z.enum(["free", "paid"]),
  price: z.number().min(0),
  currency: z.string(),
  discount: z.number().min(0).max(100),
  visibility: z.enum(["public", "private"]),
  isPublished: z.boolean().default(false),
});

// Re-export the type from the centralized location
export type { CourseFormData } from "@/types/course";

// Default values for the form
export const defaultValues: CourseFormData = {
  name: "",
  description: "",
  category: "",
  image: "",
  type: "free",
  price: 0,
  currency: "BRL",
  discount: 0,
  visibility: "public",
  isPublished: false,
};

// Currencies available for selection
export const currencies = [
  { value: "BRL", label: "R$ (BRL)" },
  { value: "USD", label: "$ (USD)" },
  { value: "EUR", label: "€ (EUR)" },
];
