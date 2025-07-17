import { SubmitButton } from "@/app/components";
import Link from "next/link";
import { useEffect } from "react";
import JSConfetti from "js-confetti";

export default function SignupSuccess({ isSuccess }: { isSuccess: boolean }) {
  useEffect(() => {
    if (isSuccess) {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        confettiNumber: 40,
        emojis: ["☀️", "🍿", "🎥", "🍿", "🎬", "🎞️", "⛅️", "🌧️", "🌤️", "🩵"],
        emojiSize: 60,
      });

      return () => jsConfetti.clearCanvas();
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 my-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <p className="text-2xl font-bold">회원가입이 완료되었습니다!</p>
        <p className="text-md text-gray-300">
          추천 받은 영화를 저장하고 기록해보세요.
        </p>
      </div>
      <Link href="/auth/signin" className="mt-8">
        <SubmitButton loading={false} text="로그인하러 가기" type="button" />
      </Link>
    </div>
  );
}
