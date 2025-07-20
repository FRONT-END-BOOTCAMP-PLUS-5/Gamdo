interface SubmitButtonProps {
  loading: boolean;
  text: string;
  loadingText?: string;
  type: "submit" | "reset" | "button";
  disabled?: boolean;
}

export default function SubmitButton({
  loading,
  text,
  loadingText,
  type,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className="
relative z-0 p-[2px] rounded-[24px] w-full
before:content-[''] before:absolute before:inset-0 before:rounded-[24px]
before:bg-[linear-gradient(-45deg,#000000_0%,#4BBEAB_100%)]
before:z-[-1] overflow-hidden
disabled:opacity-50 disabled:cursor-not-allowed
"
    >
      <span className="block bg-slate-950 rounded-[24px] px-4 py-2 text-[#56EBE1] text-center">
        {loading && loadingText ? loadingText : text}
      </span>
    </button>
  );
}
