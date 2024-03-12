import { useState } from "react";
import { ToggleListButton } from "./utils/ToggleListButton";

export default function ListBox({ items, children }) {
  const [isOpen1, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleListButton isOpen={isOpen1} setIsOpen={setIsOpen} />
      {isOpen1 && children}
    </div>
  );
}
