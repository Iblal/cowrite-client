import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EditorContentArea from "../EditorContentArea";

// Mock @tiptap/react
vi.mock("@tiptap/react", () => ({
  EditorContent: () => <div data-testid="editor-content">Editor Content</div>,
  Editor: class {},
}));

describe("EditorContentArea", () => {
  it("renders the editor content area", () => {
    const mockEditor = {} as any;
    const { getByTestId } = render(<EditorContentArea editor={mockEditor} />);
    expect(getByTestId("editor-content")).toBeInTheDocument();
  });
});
