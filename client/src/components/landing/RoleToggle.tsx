import React from "react";
import { Button } from "../ui/button";

interface RoleToggleProps {
  value: "sender" | "traveler";
  onChange: (value: "sender" | "traveler") => void;
}

export const RoleToggle: React.FC<RoleToggleProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1" role="tablist">
      <Button
        variant={value === "sender" ? "default" : "ghost"}
        size="sm"
        className={`rounded-md transition-all duration-200 ${
          value === "sender" ? "bg-white text-gray-900 shadow-sm" : ""
        }`}
        onClick={() => onChange("sender")}
        role="tab"
        aria-selected={value === "sender"}
        aria-controls="hero-content"
      >
        I want to send
      </Button>
      <Button
        variant={value === "traveler" ? "default" : "ghost"}
        size="sm"
        className={`rounded-md transition-all duration-200 ${
          value === "traveler" ? "bg-white text-gray-900 shadow-sm" : ""
        }`}
        onClick={() => onChange("traveler")}
        role="tab"
        aria-selected={value === "traveler"}
        aria-controls="hero-content"
      >
        I'm traveling
      </Button>
    </div>
  );
};
