import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

const buttonBaseClasses =
  "px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed";

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const groups = [
    {
      label: "Text style",
      buttons: [
        {
          label: "B",
          title: "Bold",
          isActive: () => editor.isActive("bold"),
          onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: "I",
          title: "Italic",
          isActive: () => editor.isActive("italic"),
          onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "S",
          title: "Strike",
          isActive: () => editor.isActive("strike"),
          onClick: () => editor.chain().focus().toggleStrike().run(),
        },
      ],
    },
    {
      label: "Headings",
      buttons: [
        {
          label: "H1",
          title: "Heading 1",
          isActive: () => editor.isActive("heading", { level: 1 }),
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          label: "H2",
          title: "Heading 2",
          isActive: () => editor.isActive("heading", { level: 2 }),
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "H3",
          title: "Heading 3",
          isActive: () => editor.isActive("heading", { level: 3 }),
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
      ],
    },
    {
      label: "Lists",
      buttons: [
        {
          label: "• List",
          title: "Bullet list",
          isActive: () => editor.isActive("bulletList"),
          onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "1. List",
          title: "Ordered list",
          isActive: () => editor.isActive("orderedList"),
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
      ],
    },
    {
      label: "History",
      buttons: [
        {
          label: "Undo",
          title: "Undo",
          isActive: () => false,
          onClick: () => editor.chain().focus().undo().run(),
        },
        {
          label: "Redo",
          title: "Redo",
          isActive: () => false,
          onClick: () => editor.chain().focus().redo().run(),
        },
      ],
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap gap-3 items-center">
        {groups.map((group) => (
          <div key={group.label} className="flex items-center gap-1">
            {group.buttons.map((button) => (
              <button
                key={button.title}
                type="button"
                className={`${buttonBaseClasses} ${
                  button.isActive() ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={button.onClick}
                title={button.title}
              >
                {button.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorToolbar;
