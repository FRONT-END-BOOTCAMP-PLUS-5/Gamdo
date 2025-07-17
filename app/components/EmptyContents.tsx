import { BsFillCloudRainFill } from "react-icons/bs";

interface EmptyContentsProps {
  text: string;
}

export default function EmptyContents({ text }: EmptyContentsProps) {
  return (
    <div className="text-center text-xl text-gray-300 p-32 flex flex-col items-center justify-center">
      <BsFillCloudRainFill className="text-6xl mb-4" />
      <span>{text}</span>
    </div>
  );
}
