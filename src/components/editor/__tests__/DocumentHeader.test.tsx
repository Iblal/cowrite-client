import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import DocumentHeader from "../DocumentHeader";

describe("DocumentHeader", () => {
  const defaultProps = {
    title: "Test Document",
    status: "Saved",
    onTitleChange: vi.fn(),
    onTitleBlur: vi.fn(),
    isOwner: true,
  };

  it("renders the document title", () => {
    render(<DocumentHeader {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Document");
    expect(input).toBeInTheDocument();
  });

  it("calls onTitleChange when input changes", () => {
    render(<DocumentHeader {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Document");
    fireEvent.change(input, { target: { value: "New Title" } });
    expect(defaultProps.onTitleChange).toHaveBeenCalled();
  });

  it("calls onTitleBlur when input blurs", () => {
    render(<DocumentHeader {...defaultProps} />);
    const input = screen.getByDisplayValue("Test Document");
    fireEvent.blur(input);
    expect(defaultProps.onTitleBlur).toHaveBeenCalled();
  });

  it('displays "Saving..." status correctly', () => {
    render(<DocumentHeader {...defaultProps} status="Saving..." />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it('displays "Saved" status correctly', () => {
    render(<DocumentHeader {...defaultProps} status="Saved" />);
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });
});
