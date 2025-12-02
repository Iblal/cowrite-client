import { EditorContent, Editor } from "@tiptap/react";

interface EditorContentAreaProps {
  editor: Editor | null;
}

const EditorContentArea = ({ editor }: EditorContentAreaProps) => {
  return (
    <main className="flex-1 overflow-y-auto py-10 px-4 sm:px-8 lg:px-16 bg-slate-100">
      <div className="flex justify-center">
        <div className="relative w-full max-w-[8.5in] min-h-[11in] bg-white shadow-lg border border-slate-200 px-10 py-12 prose prose-slate prose-headings:font-semibold prose-p:leading-relaxed">
          {/* Faux page background / margin */}
          <div
            className="pointer-events-none absolute inset-6 border border-dashed border-slate-200"
            aria-hidden="true"
          />

          {/* Actual editable area */}
          <div className="relative pointer-events-auto">
            <EditorContent editor={editor} className="focus:outline-none" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditorContentArea;
