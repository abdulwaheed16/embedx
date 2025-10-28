// app/property-estimator/page.tsx
"use client";

import PropertyEstimatorForm from "@/components/forms/property-value-estimator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Info, Settings } from "lucide-react";
import { useState } from "react";

export default function PropertyEstimatorPage() {
  const [copied, setCopied] = useState<"iframe" | "wordpress" | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Generate iframe embed code
  const generateIframeCode = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `<iframe 
  src="${baseUrl}/embed/property-estimator" 
  width="100%" 
  height="600" 
  style={{ border: 'none', borderRadius: '8px' }}
  frameborder="0">
</iframe>`;
  };

  // Generate WordPress shortcode
  const generateWordPressShortcode = () => {
    return `[property_estimator width="100%" height="600"]`;
  };

  // Copy to clipboard with animation
  const copyToClipboard = async (
    text: string,
    type: "iframe" | "wordpress"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy embed code");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-10 p-6">
      {/* Embed Button Above Form */}
      <div className="w-full max-w-lg flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-gray-300 hover:bg-gray-50"
            >
              <Settings className="h-3 w-3 mr-1" />
              Embed Form
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] p-0">
            <DialogHeader className="px-6 py-4 border-b">
              <DialogTitle className="text-lg">
                Embed Property Estimator
              </DialogTitle>
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
                      <code className="text-gray-700">
                        {generateIframeCode()}
                      </code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8"
                      onClick={() =>
                        copyToClipboard(generateIframeCode(), "iframe")
                      }
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
                      <code className="text-gray-700">
                        {generateWordPressShortcode()}
                      </code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8"
                      onClick={() =>
                        copyToClipboard(
                          generateWordPressShortcode(),
                          "wordpress"
                        )
                      }
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
                  <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-md">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-700">
                      This requires our WordPress plugin to be installed on your
                      site.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* The Form Component */}
      <PropertyEstimatorForm />

      {/* <div className="w-96">
        <iframe
          title="Property Estimator Form Preview"
          src="http://localhost:3000/embed/property-estimator"
          width="100%"
          height="600"
          style={{ border: "none", borderRadius: "8px" }}
          frameBorder="0"
        ></iframe>
      </div> */}
    </div>
  );
}
