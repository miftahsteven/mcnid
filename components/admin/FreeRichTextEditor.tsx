"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css"; 

// Dynamically import SunEditor with a more robust loading state
const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-50 flex items-center justify-center border border-gray-200 rounded-xl">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1a4731] rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 font-medium">Menyiapkan editor...</p>
      </div>
    </div>
  ),
});

interface FreeRichTextEditorProps {
  content: string;
  setContent: (val: string) => void;
  placeholder?: string;
}

export default function FreeRichTextEditor({
  content,
  setContent,
  placeholder,
}: FreeRichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<any>(null);

  // Prevent hydration error by ensuring it only renders after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[600px] border border-gray-200 rounded-xl bg-gray-50 animate-pulse" />
    );
  }

  return (
    <div className="w-full min-h-[500px] border border-gray-200 rounded-xl overflow-hidden bg-white">
      <SunEditor
        setContents={content}
        onChange={setContent}
        placeholder={placeholder || "Ketik konten atau kurasi data di sini..."}
        setOptions={{
          height: "600",
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            ["bold", "underline", "italic", "strike", "subscript", "superscript"],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            "/", 
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video"], 
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
          ],
          font: [
            "Arial", "Courier New", "Georgia", "Tahoma", "Trebuchet MS", "Verdana", "Inter", "Roboto"
          ],
          defaultStyle: 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; line-height: 1.6; padding: 10px;',
          attributesWhitelist: {
            all: "style|class|id|align|dir|lang", 
          },
          pasteTagsWhitelist: "p|br|b|i|u|strong|em|ol|ul|li|h1|h2|h3|h4|h5|h6|table|thead|tbody|tr|th|td|img|a|span|div",
        }}
      />
      {/* Use standard style tag to avoid styled-jsx hydration issues */}
      <style dangerouslySetInnerHTML={{ __html: `
        .sun-editor {
          border: none !important;
          font-family: inherit !important;
        }
        .sun-editor .se-toolbar {
          background-color: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
          outline: none !important;
        }
        .sun-editor .se-resizing-bar {
          background-color: #f9fafb !important;
        }
        .sun-editor .se-wrapper .se-wrapper-inner {
            min-height: 550px;
        }
        .sun-editor .se-btn-module-border {
            border: 1px solid #e5e7eb !important;
        }
      `}} />
    </div>
  );
}
