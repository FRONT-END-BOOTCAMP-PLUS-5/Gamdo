"use client";
import { useState } from "react";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    loginId: "",
    password: "",
    check_password: "",
    nickname: "",
    profileImage: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/auth/signup", {
        name: form.name,
        loginId: form.loginId,
        password: form.password,
        nickname: form.nickname,
        profileImage: form.profileImage || null,
      });
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || "회원가입에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center text-white max-w-7xl m-auto min-h-[728px] h-[calc(100vh-168px)]">
      <div className="flex flex-col items-center justify-center w-full max-w-xl gap-8 bg-white/5 backdrop-blur-lg p-10 rounded-lg border-[1px] border-white/10">
        <h1 className="text-2xl font-bold">Sign up</h1>
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-white block mb-2">
              이름
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="이름"
              value={form.name}
              onChange={handleChange}
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="loginId" className="text-white block mb-2">
              이메일
            </label>
            <div className="flex items-center gap-2">
              <input
                id="loginId"
                name="loginId"
                type="email"
                placeholder="gmado@example.com"
                value={form.loginId}
                onChange={handleChange}
                className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
                required
              />
              <div className="whitespace-nowrap cursor-pointer">중복확인</div>
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-white block mb-2">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={handleChange}
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="check_password" className="text-white block mb-2">
              비밀번호 확인
            </label>
            <input
              id="check_password"
              name="check_password"
              type="password"
              placeholder="비밀번호 확인"
              value={form.check_password}
              onChange={handleChange}
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label htmlFor="nickname" className="text-white block mb-2">
              닉네임
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
              className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
              required
            />
          </div>

          <button
            type="submit"
            className="
              relative z-0 p-[2px] rounded-[24px] w-full
              before:content-[''] before:absolute before:inset-0 before:rounded-[24px]
              before:bg-[linear-gradient(-45deg,#000000_0%,#4BBEAB_100%)]
              before:z-[-1] overflow-hidden
            "
          >
            <span className="block bg-slate-950 rounded-[24px] px-4 py-2 text-[#56EBE1] text-center">
              회원가입
            </span>
          </button>
        </form>
        <div className="w-full h-4">
          {error && <div className="text-red-400 text-center">{error}</div>}
        </div>
      </div>
    </div>
  );
}
