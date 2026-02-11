import * as React from "react";

interface RequiredLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

export const RequiredMark = () => (
  <span className="text-destructive ml-0.5">*</span>
);
