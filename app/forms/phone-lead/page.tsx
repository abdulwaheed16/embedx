// app/phone-lead/page.tsx
"use client";

import PhoneLeadForm from "@/components/forms/phone-lead";
import EmbedDialog from "@/components/ui/embed-dialog";
import { Settings } from "lucide-react";

export default function PhoneLeadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-10 p-6">
      {/* Admin Controls - Outside the form card */}
      <div className="w-full max-w-lg flex justify-end">
        <EmbedDialog
          embedPath="/embed/phone-lead"
          triggerText="Embed Form"
          triggerVariant="outline"
          triggerSize="sm"
          className="text-xs border-gray-300 hover:bg-gray-50"
          trigger={
            <button className="border-gray-300 hover:bg-gray-50 inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium border">
              <Settings className="h-3 w-3 mr-1" />
              Embed Form
            </button>
          }
        />
      </div>

      {/* The Form Component */}
      <PhoneLeadForm />
    </div>
  );
}
