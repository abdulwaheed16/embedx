"use client";

import FormBuilder, { FormConfig } from "@/components/forms/form-builder";
import { useEffect, useState } from "react";

export default function FormBuilderPage() {
  const [savedConfig, setSavedConfig] = useState<FormConfig | null>(null);

  useEffect(() => {
    // Load saved configuration from localStorage
    const saved = localStorage.getItem("formConfig");
    if (saved) {
      setSavedConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = (config: FormConfig) => {
    setSavedConfig(config);
    console.log("Form configuration saved:", config);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dynamic Form Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Create custom forms that can be embedded anywhere
          </p>
        </div>

        <FormBuilder
          onSave={handleSave}
          initialConfig={savedConfig || undefined}
        />
      </div>
    </div>
  );
}
