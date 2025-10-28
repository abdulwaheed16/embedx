// app/components/forms/property-value-estimator.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  propertyEstimatorSchema,
  PropertyEstimatorValues,
} from "@/lib/validations/property-estimator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PropertyEstimatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PropertyEstimatorValues>({
    resolver: zodResolver(propertyEstimatorSchema),
    defaultValues: {
      location: "",
      propertyType: "House",
      area: "",
      bedrooms: "",
      bathrooms: "",
      condition: "Good",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: PropertyEstimatorValues) => {
    setIsSubmitting(true);
    console.log("Submitted Form Data:", data);

    await new Promise((r) => setTimeout(r, 500));

    setIsSubmitting(false);
    form.reset();

    toast.success("Form submitted successfully! (Check console)");
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Home className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <CardTitle className="text-xl text-gray-900">
              Property Value Estimator
            </CardTitle>
            <CardDescription className="text-gray-600">
              Get an instant estimate of your property value
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. DHA Phase 6, Lahore"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Property Type */}
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Property Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="House">House</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Area */}
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Area (sq ft)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter total area"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-500">
                    Total covered area of the property
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bedrooms & Bathrooms */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Bedrooms
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Bathrooms
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2" {...field} className="h-10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Condition */}
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Condition
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Needs Renovation">
                        Needs Renovation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Estimating...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Estimate Value
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500 text-center w-full">
          By submitting this form, you agree to our terms of service and privacy
          policy.
        </p>
      </CardFooter>
    </Card>
  );
}
