import { useState } from "react";

interface ButtonProps {
  text: string;
  className?: string;
}

const Button = ({ className, text }: ButtonProps) => {
  const [btnColorChange, setBtnColorChange] = useState(false);
  return (
    <div>
      <button
        onClick={() => setBtnColorChange(!btnColorChange)}
        style={{ backgroundColor: btnColorChange ? "#56EBE155" : "" }}
        className={`flex border-2 rounded-lg px-4 py-2 hover:cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 ${
          className || ""
        }`}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
