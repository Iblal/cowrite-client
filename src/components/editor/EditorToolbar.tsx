import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

const buttonBaseClasses =
  "px-2 py-1 text-sm rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed";

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const groups = [
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
        {
          label: "Task",
          title: "Task list",
          isActive: () => editor.isActive("taskList"),
          onClick: () => editor.chain().focus().toggleTaskList().run(),
        },
        {
          label: "→|",
          title: "Indent",
          isActive: () => false,
          onClick: () => {
            if (editor.isActive("taskItem")) {
              return editor.chain().focus().sinkListItem("taskItem").run();
            }
            return editor.chain().focus().sinkListItem("listItem").run();
          },
        },
        {
          label: "|←",
          title: "Outdent",
          isActive: () => false,
          onClick: () => {
            if (editor.isActive("taskItem")) {
              return editor.chain().focus().liftListItem("taskItem").run();
            }
            return editor.chain().focus().liftListItem("listItem").run();
          },
        },
      ],
    },
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
          label: "U",
          title: "Underline",
          isActive: () => editor.isActive("underline"),
          onClick: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          label: "S",
          title: "Strike",
          isActive: () => editor.isActive("strike"),
          onClick: () => editor.chain().focus().toggleStrike().run(),
        },
        {
          label: "Code",
          title: "Code",
          isActive: () => editor.isActive("code"),
          onClick: () => editor.chain().focus().toggleCode().run(),
        },
        {
          label: "Quote",
          title: "Blockquote",
          isActive: () => editor.isActive("blockquote"),
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
        },
      ],
    },
    {
      label: "Script",
      buttons: [
        {
          label: "Sub",
          title: "Subscript",
          isActive: () => editor.isActive("subscript"),
          onClick: () => editor.chain().focus().toggleSubscript().run(),
        },
        {
          label: "Sup",
          title: "Superscript",
          isActive: () => editor.isActive("superscript"),
          onClick: () => editor.chain().focus().toggleSuperscript().run(),
        },
      ],
    },
    {
      label: "Align",
      buttons: [
        {
          label: "Left",
          title: "Align Left",
          isActive: () => editor.isActive({ textAlign: "left" }),
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
        },
        {
          label: "Center",
          title: "Align Center",
          isActive: () => editor.isActive({ textAlign: "center" }),
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
        },
        {
          label: "Right",
          title: "Align Right",
          isActive: () => editor.isActive({ textAlign: "right" }),
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
        },
        {
          label: "Justify",
          title: "Align Justify",
          isActive: () => editor.isActive({ textAlign: "justify" }),
          onClick: () => editor.chain().focus().setTextAlign("justify").run(),
        },
      ],
    },
    {
      label: "Insert",
      buttons: [
        {
          label: "Link",
          title: "Link",
          isActive: () => editor.isActive("link"),
          onClick: setLink,
        },
        {
          label: "Image",
          title: "Image",
          isActive: () => false,
          onClick: addImage,
        },
      ],
    },
    {
      label: "Clear",
      buttons: [
        {
          label: "Clear",
          title: "Clear Formatting",
          isActive: () => false,
          onClick: () => editor.chain().focus().unsetAllMarks().run(),
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
