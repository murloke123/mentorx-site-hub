
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BookOpen, Image as ImageIcon } from "lucide-react";

// Define os valores iniciais para o formulário
const defaultValues = {
  name: "",
  description: "",
  category: "",
  image: "",
  type: "free", // "free" ou "paid"
  price: 0,
  currency: "BRL",
  discount: 0,
};

// Define o esquema de validação do formulário
const formSchema = z.object({
  name: z.string().min(5, "O título deve conter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve conter pelo menos 20 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  image: z.string().min(1, "Selecione uma imagem para o curso"),
  type: z.enum(["free", "paid"]),
  price: z.number().min(0),
  currency: z.string(),
  discount: z.number().min(0).max(100),
});

type CourseFormData = z.infer<typeof formSchema>;

interface CourseFormProps {
  mode: "create" | "edit";
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CourseForm = ({
  mode = "create",
  initialData = defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CourseFormProps) => {
  const [courseType, setCourseType] = useState(initialData.type);
  
  const form = useForm<CourseFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: CourseFormData) => {
    // Processar os dados e chamar a função onSubmit
    onSubmit(data);
  };
  
  // Categorias disponíveis
  const categories = [
    { value: "personal-development", label: "Desenvolvimento Pessoal" },
    { value: "programming", label: "Programação" },
    { value: "finance", label: "Finanças" },
    { value: "leadership", label: "Liderança" },
    { value: "digital-marketing", label: "Marketing Digital" },
    { value: "sales", label: "Vendas" },
  ];

  // Moedas disponíveis
  const currencies = [
    { value: "BRL", label: "R$ (BRL)" },
    { value: "USD", label: "$ (USD)" },
    { value: "EUR", label: "€ (EUR)" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Nome do Curso*</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome do curso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Forneça um resumo do seu curso, destacando o conteúdo e os principais benefícios para o aluno..." 
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Categoria*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Imagem do Curso*</FormLabel>
                  <FormControl>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Input
                        id="courseImage"
                        type="file"
                        className="cursor-pointer"
                        onChange={(e) => {
                          // Em uma aplicação real, você faria upload e usaria a URL
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                      />
                      
                      {field.value ? (
                        <div className="rounded-md border mt-2 overflow-hidden">
                          <img 
                            src={field.value} 
                            alt="Course preview" 
                            className="h-48 w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="border rounded-md flex items-center justify-center h-48 bg-muted mt-2">
                          <div className="flex flex-col items-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mb-2" />
                            <span>Tamanho sugerido: 1280x720px</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Tipo de Curso*</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setCourseType(value as "free" | "paid");
                      }}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free">Gratuito</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <Label htmlFor="paid">Pago</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {courseType === "paid" && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01"
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desconto (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Deixe em 0 para não aplicar desconto
                      </FormDescription>
                      <FormMessage />
                      
                      {field.value > 0 && form.watch("price") > 0 && (
                        <div className="mt-2 bg-green-50 p-2 rounded-md">
                          <p className="text-sm">
                            <span className="line-through text-red-500">
                              {form.watch("currency") === "BRL" ? "R$" : form.watch("currency") === "USD" ? "$" : "€"}
                              {form.watch("price").toFixed(2)}
                            </span>
                            {" → "}
                            <span className="text-green-600 font-semibold">
                              {form.watch("currency") === "BRL" ? "R$" : form.watch("currency") === "USD" ? "$" : "€"}
                              {(form.watch("price") * (1 - form.watch("discount") / 100)).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : mode === "create" ? "Criar Curso" : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
