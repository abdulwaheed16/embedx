// app/components/forms/FormBuilder.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, Code, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface FormField {
  id: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  submitButtonText: string;
  successMessage: string;
  webhookUrl?: string;
  fields: FormField[];
  primaryColor: string;
  backgroundColor: string;
  borderRadius: number;
  createdAt: Date;
  updatedAt: Date;
}

interface FormBuilderProps {
  onSave: (config: FormConfig) => void;
  initialConfig?: Partial<FormConfig>;
}

export default function FormBuilder({ onSave, initialConfig }: FormBuilderProps) {
  const [config, setConfig] = useState<Partial<FormConfig>>({
    title: "Property Value Estimator",
    description: "Get an instant estimate of your property value",
    submitButtonText: "Estimate Value",
    successMessage: "Thank you! We'll get back to you soon.",
    webhookUrl: "",
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    fields: [
      {
        id: uuidv4(),
        type: "text",
        label: "Location",
        placeholder: "e.g. DHA Phase 6, Lahore",
        required: true,
      },
      {
        id: uuidv4(),
        type: "select",
        label: "Property Type",
        required: true,
        options: ["House", "Apartment", "Plot"],
      },
      {
        id: uuidv4(),
        type: "number",
        label: "Area (sq ft)",
        placeholder: "Enter total area",
        required: true,
      },
    ],
    ...initialConfig,
  });

  const [copied, setCopied] = useState<"iframe" | "wordpress" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      label: `New ${type} field`,
      required: false,
    };

    if (type === "select" || type === "radio" || type === "checkbox") {
      newField.options = ["Option 1", "Option 2"];
    }

    setConfig(prev => ({
      ...prev,
      fields: [...(prev.fields || []), newField],
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields?.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
    }));
  };

  const removeField = (fieldId: string) => {
    setConfig(prev => ({
      ...prev,
      fields: prev.fields?.filter(field => field.id !== fieldId),
    }));
  };

  const handleSave = () => {
    const formConfig: FormConfig = {
      ...config,
      id: config.id || uuidv4(),
      createdAt: config.createdAt || new Date(),
      updatedAt: new Date(),
    } as FormConfig;

    // Save to localStorage for demo purposes
    localStorage.setItem("formConfig", JSON.stringify(formConfig));
    onSave(formConfig);
  };

  // Generate iframe embed code
  const generateIframeCode = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `<iframe 
  src="${baseUrl}/embed/dynamic-form?id=${config.id}" 
  width="100%" 
  height="600" 
  style="border:none; border-radius:8px;"
  frameborder="0">
</iframe>`;
  };

  // Generate WordPress shortcode
  const generateWordPressShortcode = () => {
    return `[dynamic_form id="${config.id}" width="100%" height="600"]`;
  };

  // Copy to clipboard with animation
  const copyToClipboard = async (text: string, type: "iframe" | "wordpress") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy embed code");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Embed Button */}
      {config.id && (
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                Embed Form
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0">
              <DialogHeader className="px-6 py-4 border-b">
                <DialogTitle className="text-lg">Embed Dynamic Form</DialogTitle>
                <DialogDescription className="text-sm text-gray-600">
                  Copy the code to embed this form on your website
                </DialogDescription>
              </DialogHeader>
              
              <div className="px-6 py-4">
                <Tabs defaultValue="iframe" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-9">
                    <TabsTrigger value="iframe">iFrame</TabsTrigger>
                    <TabsTrigger value="wordpress">WordPress</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="iframe" className="mt-4">
                    <div className="relative">
                      <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-x-auto h-32 border border-gray-200">
                        <code className="text-gray-700">{generateIframeCode()}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 h-8"
                        onClick={() => copyToClipboard(generateIframeCode(), "iframe")}
                      >
                        {copied === "iframe" ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="wordpress" className="mt-4">
                    <div className="relative">
                      <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-x-auto h-32 border border-gray-200">
                        <code className="text-gray-700">{generateWordPressShortcode()}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 h-8"
                        onClick={() => copyToClipboard(generateWordPressShortcode(), "wordpress")}
                      >
                        {copied === "wordpress" ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
          <CardDescription>Configure your form appearance and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                value={config.title || ""}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="submitButtonText">Submit Button Text</Label>
              <Input
                id="submitButtonText"
                value={config.submitButtonText || ""}
                onChange={(e) => setConfig(prev => ({ ...prev, submitButtonText: e.target.value }))}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description || ""}
              onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="successMessage">Success Message</Label>
            <Textarea
              id="successMessage"
              value={config.successMessage || ""}
              onChange={(e) => setConfig(prev => ({ ...prev, successMessage: e.target.value }))}
              rows={2}
            />
          </div>
          
          <div>
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://example.com/webhook"
              value={config.webhookUrl || ""}
              onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primaryColor">Primary Color</Label>
              <Input
                id="primaryColor"
                type="color"
                value={config.primaryColor || "#3b82f6"}
                onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={config.backgroundColor || "#ffffff"}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="borderRadius">Border Radius (px)</Label>
              <Input
                id="borderRadius"
                type="number"
                value={config.borderRadius || 8}
                onChange={(e) => setConfig(prev => ({ ...prev, borderRadius: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Field Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Add Fields</CardTitle>
          <CardDescription>Choose the type of field to add to your form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(["text", "email", "number", "textarea", "select", "checkbox", "radio"] as const).map(type => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => addField(type)}
                className="capitalize"
              >
                <Plus className="h-4 w-4 mr-1" />
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
          <CardDescription>Configure the fields for your form</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.fields?.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{field.label}</span>
                  <span className="text-sm text-gray-500">({field.type})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Field Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder || ""}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                  />
                </div>
              </div>
              
              {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                <div>
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join("\n") || ""}
                    onChange={(e) => updateField(field.id, { 
                      options: e.target.value.split("\n").filter(opt => opt.trim()) 
                    })}
                    rows={3}
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                />
                <Label>Required field</Label>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Form Configuration
        </Button>
      </div>
    </div>
  );
}