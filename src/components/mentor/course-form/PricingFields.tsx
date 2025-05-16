
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CourseFormData, currencies } from "./FormSchema";

interface PricingFieldsProps {
  form: UseFormReturn<CourseFormData>;
}

const PricingFields = ({ form }: PricingFieldsProps) => {
  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="flex-1">
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
            <FormItem className="w-full sm:w-[180px]">
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
      </div>

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
  );
};

export default PricingFields;
