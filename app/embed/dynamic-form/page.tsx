// app/embed/dynamic-form/page.tsx
"use client";

import { FormConfig } from "@/components/forms/form-builder";
import DynamicFormRenderer from "@/components/forms/form-rederer";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Default form configuration
const DEFAULT_FORM_CONFIG: FormConfig = {
  id: "a880ad94-9840-4de5-b418-b3076b9ccd22",
  title: "Property Value Estimator",
  description: "Get an instant estimate of your property value",
  submitButtonText: "Estimate Value",
  successMessage: "Thank you! We'll get back to you soon.",
  webhookUrl: "",
  primaryColor: "#041e48",
  backgroundColor: "#eee9e9",
  borderRadius: 8,
  fields: [
    {
      id: "fed0efd8-347d-40ad-bdfa-e9f72ce8f908",
      type: "text",
      label: "Location",
      placeholder: "e.g. DHA Phase 6, Lahore",
      required: true,
    },
    {
      id: "16319d4c-1a94-471b-84be-f2ffeea27085",
      type: "select",
      label: "Property Type",
      required: true,
      options: ["House", "Apartment", "Plot"],
    },
  ],
  createdAt: new Date("2025-10-27T18:47:53.376Z"),
  updatedAt: new Date("2025-10-27T18:47:53.376Z"),
};

export default function DynamicFormEmbedPage() {
  const searchParams = useSearchParams();
  const formId = searchParams?.get("id");
  const [config, setConfig] = useState<FormConfig>(DEFAULT_FORM_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const staticFormId = "84214162-cadf-4be7-a6a0-d2f2bb309d1e";

  // Function to load form configuration
  const loadFormConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading form configuration...");
      console.log("Form ID from URL:", formId);

      // If no formId provided, use default config
      //   if (!formId) {
      //     console.log("No form ID provided, using default configuration");
      //     setConfig(DEFAULT_FORM_CONFIG);
      //     setLoading(false);
      //     return;
      //   }

      // Try to get from localStorage
      const saved = localStorage.getItem("formConfig");
      console.log("Saved configuration found:", !!saved);

      if (saved) {
        const formConfig = JSON.parse(saved) as FormConfig;
        console.log("Loaded form config:", formConfig);

        // Use the saved config if it matches the requested ID
        if (formConfig.id === staticFormId) {
          console.log("Form configuration matched");
          setConfig(formConfig);
        } else {
          console.log("Form ID mismatch, using default config");
          setConfig(DEFAULT_FORM_CONFIG);
        }
      } else {
        console.log("No saved configuration, using default");
        setConfig(DEFAULT_FORM_CONFIG);
      }
    } catch (err) {
      console.error("Error loading form configuration:", err);
      setError("Failed to load form configuration");
      setConfig(DEFAULT_FORM_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [formId]);

  // Initialize localStorage with default config if empty
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("formConfig")) {
        console.log("Initializing localStorage with default configuration");
        localStorage.setItem("formConfig", JSON.stringify(DEFAULT_FORM_CONFIG));
      }
    }
  }, []);

  // Load configuration when component mounts or formId changes
  useEffect(() => {
    loadFormConfig();
  }, [loadFormConfig]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <div className="text-gray-600">Loading form...</div>
          {formId && (
            <div className="text-xs text-gray-500">Form ID: {formId}</div>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="text-red-500 text-lg font-medium">{error}</div>
          <button
            onClick={loadFormConfig}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render form
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <DynamicFormRenderer config={config} />
    </div>
  );
}
