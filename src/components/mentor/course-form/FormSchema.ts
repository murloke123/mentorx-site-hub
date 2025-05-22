
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

// Define the type for the form data
export type CourseFormData = z.infer<typeof formSchema>;

// Default values for the form
export const defaultValues: CourseFormData = {
  name: "",
  description: "",
  category: "",
  image: "",
  type: "free", // "free" ou "paid"
  price: 0,
  currency: "BRL",
  discount: 0,
  visibility: "public", // "public" ou "private"
  isPublished: false,
};

// Category mappings - containing UUID values that match the database
export const categoryMappings = {
  "personal-development": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // UUID para Desenvolvimento Pessoal
  "programming": "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22", // UUID para Programação
  "finance": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33", // UUID para Finanças
  "leadership": "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44", // UUID para Liderança
  "digital-marketing": "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55", // UUID para Marketing Digital
  "sales": "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66", // UUID para Vendas
};

// Categories available for selection
export const categories = [
  { value: "personal-development", label: "Desenvolvimento Pessoal" },
  { value: "programming", label: "Programação" },
  { value: "finance", label: "Finanças" },
  { value: "leadership", label: "Liderança" },
  { value: "digital-marketing", label: "Marketing Digital" },
  { value: "sales", label: "Vendas" },
];

// Currencies available for selection
export const currencies = [
  { value: "BRL", label: "R$ (BRL)" },
  { value: "USD", label: "$ (USD)" },
  { value: "EUR", label: "€ (EUR)" },
];
