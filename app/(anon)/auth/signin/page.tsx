"use client";
import { useState } from "react";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/userStore";
import useLoading from "@/app/hooks/useLoading";
import { SubmitButton } from "@/app/components";

export default function SigninPage() {
  const router = useRouter();
  const { login } = useUserStore();
  const [loading, setIsLoading] = useLoading(false);

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/auth/signin", {
        loginId: form.loginId,
        password: form.password,
      });

      // 로그인 성공 시 유저 정보를 전역상태에 저장
      if (response.data.result?.user) {
        console.log(response.data.result.user);
        login(response.data.result.user);
        // 메인 페이지로 리다이렉트
        router.replace("/");
      }
    } catch (err: unknown) {
      setIsLoading(false);
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || "로그인에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("로그인에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center text-white max-w-7xl m-auto min-h-[506px] h-[calc(100vh-168px)]">
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-8 bg-white/5 backdrop-blur-lg p-10 rounded-lg border-[1px] border-white/10">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <form className="flex flex-col gap-8 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login_id" className="text-white block mb-2 ">
              이메일
            </label>
            <input
              id="login_id"
              name="loginId"
              type="text"
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              placeholder="gmado@example.com"
              value={form.loginId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-white block mb-2">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <SubmitButton
            loading={loading}
            text="로그인"
            loadingText="로그인 중..."
            type="submit"
          />
        </form>
        <div className="w-full h-4">
          {error && <div className="text-red-400 text-center">{error}</div>}
        </div>
        <div className="text-white font-extralight">
          아직 회원이 아니신가요?
          <Link href="/auth/signup" className="font-bold ml-2">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
