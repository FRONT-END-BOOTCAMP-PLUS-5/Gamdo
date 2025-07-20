import { useState } from "react";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
}

const Button = ({ className, text, onClick }: ButtonProps) => {
  const [btnColorChange, setBtnColorChange] = useState(false);

  const handleClick = () => {
    setBtnColorChange(!btnColorChange);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
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
