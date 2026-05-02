import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TimelineStepper } from "../../components/TimelineStepper";

const mockSteps = [
  { id: "1", title: "Step 1", description: "Desc 1", icon: "A" },
  { id: "2", title: "Step 2", description: "Desc 2", icon: "B", durationDays: 7 },
  { id: "3", title: "Step 3", description: "Desc 3", icon: "C" },
  { id: "4", title: "Step 4", description: "Desc 4", icon: "D", durationDays: 14 },
  { id: "5", title: "Step 5", description: "Desc 5", icon: "E" },
];

describe("TimelineStepper", () => {
  it("renders all step titles and descriptions", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    mockSteps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it("renders step numbers (1-indexed)", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    for (let i = 1; i <= mockSteps.length; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("renders duration badge only for steps with durationDays", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    expect(screen.getByText("7 Days")).toBeInTheDocument();
    expect(screen.getByText("14 Days")).toBeInTheDocument();
  });

  it("renders ECI Verified Step badge for every step", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    const badges = screen.getAllByText("ECI Verified Step");
    expect(badges).toHaveLength(mockSteps.length);
  });

  it("renders Details button for every step", () => {
    render(<TimelineStepper steps={mockSteps} />);
    
    const detailButtons = screen.getAllByText("Details");
    expect(detailButtons).toHaveLength(mockSteps.length);
  });

  it("returns null for empty steps array", () => {
    const { container } = render(<TimelineStepper steps={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("renders a single step correctly", () => {
    const singleStep = [{ id: "only", title: "Only Step", description: "Only desc", icon: "Z" }];
    render(<TimelineStepper steps={singleStep} />);
    
    expect(screen.getByText("Only Step")).toBeInTheDocument();
    expect(screen.getByText("Only desc")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
