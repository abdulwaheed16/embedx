// app/components/ui/embed-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Code, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

interface EmbedDialogProps {
  embedPath: string;
  trigger?: React.ReactNode;
  triggerText?: string;
  triggerVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  title?: string;
  description?: string;
  className?: string;
}

export default function EmbedDialog({
  embedPath,
  trigger,
  triggerText = "Embed Form",
  triggerVariant = "outline",
  triggerSize = "sm",
  title = "Embed Form",
  description = "Copy the code to embed this form on your website",
  className,
}: EmbedDialogProps) {
  const [copied, setCopied] = useState<"iframe" | "wordpress" | null>(null);
  const [open, setOpen] = useState(false);

  // Generate iframe embed code
  const generateIframeCode = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `<iframe 
  src="${baseUrl}${embedPath}" 
  width="100%" 
  height="600" 
  style="border:none; border-radius:8px;"
  frameborder="0">
</iframe>`;
  };

  // Generate WordPress shortcode
  const generateWordPressShortcode = () => {
    const pathName = embedPath.replace("/embed/", "");
    return `[${pathName} width="100%" height="600"]`;
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={className}
          >
            <Code className="h-4 w-4 mr-2" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {description}
              </DialogDescription>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
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
                    copyToClipboard(generateWordPressShortcode(), "wordpress")
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
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
