import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditorToolbar from "../EditorToolbar";

describe("EditorToolbar", () => {
  const mockRun = vi.fn();
  const mockChain = {
    focus: vi.fn().mockReturnThis(),
    toggleBold: vi.fn().mockReturnThis(),
    toggleItalic: vi.fn().mockReturnThis(),
    toggleUnderline: vi.fn().mockReturnThis(),
    toggleStrike: vi.fn().mockReturnThis(),
    toggleCode: vi.fn().mockReturnThis(),
    toggleBlockquote: vi.fn().mockReturnThis(),
    toggleHeading: vi.fn().mockReturnThis(),
    toggleBulletList: vi.fn().mockReturnThis(),
    toggleOrderedList: vi.fn().mockReturnThis(),
    toggleTaskList: vi.fn().mockReturnThis(),
    undo: vi.fn().mockReturnThis(),
    redo: vi.fn().mockReturnThis(),
    setTextAlign: vi.fn().mockReturnThis(),
    unsetAllMarks: vi.fn().mockReturnThis(),
    run: mockRun,
  };

  const mockEditor = {
    chain: () => mockChain,
    isActive: vi.fn().mockReturnValue(false),
    getAttributes: vi.fn().mockReturnValue({}),
  } as any;

  it("renders nothing when editor is null", () => {
    const { container } = render(<EditorToolbar editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders toolbar buttons when editor is provided", () => {
    render(<EditorToolbar editor={mockEditor} />);
    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Italic")).toBeInTheDocument();
  });

  it("calls toggleBold when Bold button is clicked", () => {
    render(<EditorToolbar editor={mockEditor} />);
    const boldButton = screen.getByTitle("Bold");
    fireEvent.click(boldButton);
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleBold).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalled();
  });
});
