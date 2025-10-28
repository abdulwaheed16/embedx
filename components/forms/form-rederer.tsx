// app/components/forms/DynamicFormRenderer.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FormConfig } from "./form-builder";

interface DynamicFormRendererProps {
  config: FormConfig;
}

export default function DynamicFormRenderer({
  config,
}: DynamicFormRendererProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Create dynamic validation schema based on form fields
  const createValidationSchema = () => {
    const schemaObject: Record<string, z.ZodTypeAny> = {};

    config.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case "email":
          fieldSchema = z.string().email("Invalid email address");
          break;
        case "number":
          fieldSchema = z.string().refine((val) => !isNaN(Number(val)), {
            message: "Must be a valid number",
          });
          if (field.validation?.min !== undefined) {
            fieldSchema = fieldSchema.refine(
              (val) => Number(val) >= field.validation!.min!,
              { message: `Minimum value is ${field.validation!.min}` }
            );
          }
          if (field.validation?.max !== undefined) {
            fieldSchema = fieldSchema.refine(
              (val) => Number(val) <= field.validation!.max!,
              { message: `Maximum value is ${field.validation!.max}` }
            );
          }
          break;
        case "select":
        case "radio":
          fieldSchema = z
            .string()
            .refine((val) => field.options?.includes(val), {
              message: "Please select a valid option",
            });
          break;
        case "checkbox":
          fieldSchema = z.array(z.string());
          break;
        default:
          fieldSchema = z.string();
          if (field.validation?.pattern) {
            fieldSchema = z
              .string()
              .regex(new RegExp(field.validation.pattern), {
                message: "Invalid format",
              });
          }
          break;
      }

      if (field.required) {
        if (field.type === "checkbox") {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).min(
            1,
            "At least one option must be selected"
          );
        } else {
          fieldSchema = (fieldSchema as z.ZodString).min(
            1,
            `${field.label} is required`
          );
        }
      } else {
        if (field.type === "checkbox") {
          fieldSchema = fieldSchema.optional();
        } else {
          fieldSchema = fieldSchema.optional().or(z.literal(""));
        }
      }

      schemaObject[field.id] = fieldSchema;
    });

    return z.object(schemaObject);
  };

  const formSchema = createValidationSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: config.fields.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.id] = [];
      } else {
        acc[field.id] = "";
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Send data to webhook if configured
      if (config.webhookUrl) {
        await fetch(config.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: config.id,
            formTitle: config.title,
            submittedAt: new Date().toISOString(),
            data: data,
          }),
        });
      }

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card
        className="w-full max-w-lg mx-auto"
        style={{
          backgroundColor: config.backgroundColor,
          borderRadius: `${config.borderRadius}px`,
        }}
      >
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h3 className="text-lg font-medium">{config.successMessage}</h3>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-lg mx-auto"
      style={{
        backgroundColor: config.backgroundColor,
        borderRadius: `${config.borderRadius}px`,
      }}
    >
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        {config.description && (
          <CardDescription>{config.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {config.fields.map((field) => {
            // Use useWatch for checkbox fields to get proper typing
            const fieldValue = useWatch({
              control,
              name: field.id,
              defaultValue: field.type === "checkbox" ? [] : "",
            });

            return (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>

                {field.type === "select" ? (
                  <Select
                    onValueChange={(value) => setValue(field.id, value)}
                    defaultValue={fieldValue as string | undefined}
                  >
                    <SelectTrigger
                      className={errors[field.id] ? "border-red-500" : ""}
                    >
                      <SelectValue
                        placeholder={
                          field.placeholder || `Select ${field.label}`
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    placeholder={field.placeholder}
                    {...register(field.id)}
                    className={errors[field.id] ? "border-red-500" : ""}
                    rows={3}
                  />
                ) : field.type === "checkbox" ? (
                  <div className="space-y-2">
                    {field.options?.map((option) => {
                      const isChecked =
                        Array.isArray(fieldValue) &&
                        fieldValue.includes(option);
                      return (
                        <div
                          key={option}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`${field.id}-${option}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const currentValues = (
                                Array.isArray(fieldValue) ? fieldValue : []
                              ) as string[];
                              if (checked) {
                                setValue(field.id, [...currentValues, option]);
                              } else {
                                setValue(
                                  field.id,
                                  currentValues.filter(
                                    (v: string) => v !== option
                                  )
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`${field.id}-${option}`}>
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                ) : field.type === "radio" ? (
                  <RadioGroup
                    value={fieldValue as unknown as string}
                    onValueChange={(value) => setValue(field.id, value)}
                  >
                    {field.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`${field.id}-${option}`}
                        />
                        <Label htmlFor={`${field.id}-${option}`}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.id)}
                    className={errors[field.id] ? "border-red-500" : ""}
                  />
                )}

                {errors[field.id] && (
                  <p className="text-sm text-red-500">
                    {errors[field.id]?.message}
                  </p>
                )}
              </div>
            );
          })}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            style={{ backgroundColor: config.primaryColor }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              config.submitButtonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
