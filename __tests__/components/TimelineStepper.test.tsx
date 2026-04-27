import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TimelineStepper } from "../../components/TimelineStepper";

const mockSteps = [
  { id: "1", title: "Step 1", description: "Desc 1", icon: "A" },
  { id: "2", title: "Step 2", description: "Desc 2", icon: "B" },
  { id: "3", title: "Step 3", description: "Desc 3", icon: "C" },
  { id: "4", title: "Step 4", description: "Desc 4", icon: "D" },
  { id: "5", title: "Step 5", description: "Desc 5", icon: "E" },
];

describe("TimelineStepper", () => {
  it("renders mock steps and makes step 0 active by default", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    // Title is rendered based on active step
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    
    // Check buttons
    const buttons = screen.getAllByRole("button").filter(b => b.textContent && /^\d+$/.test(b.textContent));
    expect(buttons).toHaveLength(5);
    expect(buttons[0]).toHaveAttribute("aria-current", "step");
  });

  it("handles keyboard navigation (ArrowRight/ArrowLeft)", () => {
    render(<TimelineStepper steps={mockSteps} />);
    const container = screen.getByLabelText("Election Process Timeline");
    
    fireEvent.keyDown(container, { key: "ArrowRight" });
    expect(screen.getByText("Step 2")).toBeInTheDocument();

    fireEvent.keyDown(container, { key: "ArrowRight" });
    expect(screen.getByText("Step 3")).toBeInTheDocument();

    fireEvent.keyDown(container, { key: "ArrowLeft" });
    expect(screen.getByText("Step 2")).toBeInTheDocument();
  });

  it("handles bounds on ArrowLeft/ArrowRight", () => {
    render(<TimelineStepper steps={mockSteps} />);
    const container = screen.getByLabelText("Election Process Timeline");
    
    fireEvent.keyDown(container, { key: "ArrowLeft" });
    expect(screen.getByText("Step 1")).toBeInTheDocument(); // Stays at 0

    // Go to end
    for(let i=0; i<6; i++) {
        fireEvent.keyDown(container, { key: "ArrowRight" });
    }
    expect(screen.getByText("Step 5")).toBeInTheDocument(); // Stays at 4
  });

  it("handles click navigation", () => {
    render(<TimelineStepper steps={mockSteps} />);
    const button3 = screen.getByText("4"); // Button 4 is index 3
    
    fireEvent.click(button3);
    expect(screen.getByText("Step 4")).toBeInTheDocument();
  });
});
