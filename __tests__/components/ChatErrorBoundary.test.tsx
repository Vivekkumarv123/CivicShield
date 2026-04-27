import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChatErrorBoundary } from "../../components/ChatErrorBoundary";

const ThrowError = () => {
  throw new Error("Test Error");
};

describe("ChatErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <ChatErrorBoundary>
        <ThrowError />
      </ChatErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test Error")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("resets error state when Try again is clicked", () => {
    let shouldThrow = true;
    const ConditionalThrow = () => {
        if(shouldThrow) throw new Error("Err");
        return <div>Safe</div>;
    }

    const { rerender } = render(
      <ChatErrorBoundary>
        <ConditionalThrow />
      </ChatErrorBoundary>
    );

    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    
    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    
    // As the component resets, we re-render
    rerender(
        <ChatErrorBoundary>
          <ConditionalThrow />
        </ChatErrorBoundary>
      );
    expect(screen.getByText("Safe")).toBeInTheDocument();
  });
});
