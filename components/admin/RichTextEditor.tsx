"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the TinyMCE Editor with SSR disabled to prevent hydration errors
const Editor = dynamic(() => import("@tinymce/tinymce-react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-50 flex items-center justify-center border border-gray-200 rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1a4731] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Memuat editor konten...</p>
      </div>
    </div>
  ),
});

interface RichTextEditorProps {
  content: string;
  setContent: (val: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  setContent,
  placeholder,
}: RichTextEditorProps) {
  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  return (
    <div className="w-full min-h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Editor
        apiKey="icpu8i8qt8hv7getm3lw9j87t6qw0gkpdcdbhxlvffjvk2v1"
        value={content}
        init={{
          height: 600,
          menubar: "edit insert view format table help",
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            "emoticons",
            "directionality",
            "pagebreak",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | emoticons | image media link | table | code help",
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; line-height: 1.6; padding: 20px; }',
          placeholder:
            placeholder ||
            "Ketik konten atau copy-paste dari Word/PDF/WhatsApp di sini...",
          branding: false,
          promotion: false,
          paste_data_images: true,
          setup: (editor: any) => {
            editor.on("OpenWindow", (e: any) => {
              // Fix for some z-index issues in modals if needed
            });
          },
        }}
        onEditorChange={handleEditorChange}
      />
    </div>
  );
}
