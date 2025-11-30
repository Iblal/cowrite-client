import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  Indent,
  Outdent,
  Undo,
  Redo,
  Subscript,
  Superscript,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  RemoveFormatting,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

const buttonBaseClasses =
  "p-2 text-sm rounded hover:bg-gray-100 text-gray-700 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed";

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
          icon: <Undo className="w-4 h-4" />,
          title: "Undo",
          isActive: () => false,
          onClick: () => editor.chain().focus().undo().run(),
        },
        {
          label: "Redo",
          icon: <Redo className="w-4 h-4" />,
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
          icon: <Heading1 className="w-4 h-4" />,
          title: "Heading 1",
          isActive: () => editor.isActive("heading", { level: 1 }),
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          label: "H2",
          icon: <Heading2 className="w-4 h-4" />,
          title: "Heading 2",
          isActive: () => editor.isActive("heading", { level: 2 }),
          onClick: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "H3",
          icon: <Heading3 className="w-4 h-4" />,
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
          label: "Bullet list",
          icon: <List className="w-4 h-4" />,
          title: "Bullet list",
          isActive: () => editor.isActive("bulletList"),
          onClick: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "Ordered list",
          icon: <ListOrdered className="w-4 h-4" />,
          title: "Ordered list",
          isActive: () => editor.isActive("orderedList"),
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "Task list",
          icon: <ListTodo className="w-4 h-4" />,
          title: "Task list",
          isActive: () => editor.isActive("taskList"),
          onClick: () => editor.chain().focus().toggleTaskList().run(),
        },
        {
          label: "Indent",
          icon: <Indent className="w-4 h-4" />,
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
          label: "Outdent",
          icon: <Outdent className="w-4 h-4" />,
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
          label: "Bold",
          icon: <Bold className="w-4 h-4" />,
          title: "Bold",
          isActive: () => editor.isActive("bold"),
          onClick: () => editor.chain().focus().toggleBold().run(),
        },
        {
          label: "Italic",
          icon: <Italic className="w-4 h-4" />,
          title: "Italic",
          isActive: () => editor.isActive("italic"),
          onClick: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          label: "Underline",
          icon: <Underline className="w-4 h-4" />,
          title: "Underline",
          isActive: () => editor.isActive("underline"),
          onClick: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          label: "Strike",
          icon: <Strikethrough className="w-4 h-4" />,
          title: "Strike",
          isActive: () => editor.isActive("strike"),
          onClick: () => editor.chain().focus().toggleStrike().run(),
        },
        {
          label: "Code",
          icon: <Code className="w-4 h-4" />,
          title: "Code",
          isActive: () => editor.isActive("code"),
          onClick: () => editor.chain().focus().toggleCode().run(),
        },
        {
          label: "Blockquote",
          icon: <Quote className="w-4 h-4" />,
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
          label: "Subscript",
          icon: <Subscript className="w-4 h-4" />,
          title: "Subscript",
          isActive: () => editor.isActive("subscript"),
          onClick: () => editor.chain().focus().toggleSubscript().run(),
        },
        {
          label: "Superscript",
          icon: <Superscript className="w-4 h-4" />,
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
          label: "Align Left",
          icon: <AlignLeft className="w-4 h-4" />,
          title: "Align Left",
          isActive: () => editor.isActive({ textAlign: "left" }),
          onClick: () => editor.chain().focus().setTextAlign("left").run(),
        },
        {
          label: "Align Center",
          icon: <AlignCenter className="w-4 h-4" />,
          title: "Align Center",
          isActive: () => editor.isActive({ textAlign: "center" }),
          onClick: () => editor.chain().focus().setTextAlign("center").run(),
        },
        {
          label: "Align Right",
          icon: <AlignRight className="w-4 h-4" />,
          title: "Align Right",
          isActive: () => editor.isActive({ textAlign: "right" }),
          onClick: () => editor.chain().focus().setTextAlign("right").run(),
        },
        {
          label: "Align Justify",
          icon: <AlignJustify className="w-4 h-4" />,
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
          icon: <Link className="w-4 h-4" />,
          title: "Link",
          isActive: () => editor.isActive("link"),
          onClick: setLink,
        },
        {
          label: "Image",
          icon: <Image className="w-4 h-4" />,
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
          label: "Clear Formatting",
          icon: <RemoveFormatting className="w-4 h-4" />,
          title: "Clear Formatting",
          isActive: () => false,
          onClick: () => editor.chain().focus().unsetAllMarks().run(),
        },
      ],
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap gap-3 items-center justify-center">
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
                {button.icon || button.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorToolbar;
