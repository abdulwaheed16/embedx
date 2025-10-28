"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { phoneLeadSchema, PhoneLeadValues } from "@/lib/validations/phone-lead";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PhoneLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PhoneLeadValues>({
    resolver: zodResolver(phoneLeadSchema),
    defaultValues: { phone: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: PhoneLeadValues) => {
    setIsSubmitting(true);
    console.log("Phone lead submitted:", data);

    await new Promise((r) => setTimeout(r, 600));

    setIsSubmitting(false);
    form.reset();
    toast.success("Phone number submitted successfully!");
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-2xl w-full max-w-md">
      <h2 className="text-xl font-semibold mb-5 text-center">
        Get Your Property Estimate
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+92 300 1234567"
                    {...field}
                    inputMode="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-medium"
          >
            {isSubmitting ? "Submitting..." : "Get Estimate"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
