"use client";
import { useState } from "react";
import axios from "@/utils/axios";
import { isAxiosError } from "axios";
import SignupForm from "./components/SignupForm";
import SignupSuccess from "./components/SignupSuccess";
import useLoading from "@/app/hooks/useLoading";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateNickname,
} from "@/utils/validation";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    loginId: "",
    password: "",
    check_password: "",
    nickname: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    loginId: "",
    password: "",
    check_password: "",
    nickname: "",
  });

  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useLoading(false);

  const validateField = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (value && !validateName(value)) {
          errorMessage =
            "이름은 한글, 영어, 숫자, 공백만 허용되며 10자 이내여야 합니다.";
        }
        break;
      case "loginId":
        if (value && !validateEmail(value)) {
          errorMessage = "올바른 이메일 형식을 입력해주세요.";
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          errorMessage =
            "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.";
        }
        break;
      case "nickname":
        if (value && !validateNickname(value)) {
          errorMessage =
            "닉네임은 한글, 영어, 숫자, 특수문자만 허용되며 8자 이내여야 합니다.";
        }
        break;
      case "check_password":
        if (value && value !== form.password) {
          errorMessage = "비밀번호가 일치하지 않습니다.";
        }
        break;
    }

    return errorMessage;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 실시간 밸리데이션
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));

    // 비밀번호가 변경되면 비밀번호 확인 필드도 다시 검증
    if (name === "password") {
      const checkPasswordError = validateField(
        "check_password",
        form.check_password
      );
      setErrors((prev) => ({ ...prev, check_password: checkPasswordError }));
    }
  };

  const isFormValid = (): boolean => {
    return !!(
      form.name &&
      form.loginId &&
      form.password &&
      form.check_password &&
      form.nickname &&
      !errors.name &&
      !errors.loginId &&
      !errors.password &&
      !errors.check_password &&
      !errors.nickname
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post("/auth/signup", {
        name: form.name,
        loginId: form.loginId,
        password: form.password,
        nickname: form.nickname,
        profileImage: form.profileImage || null,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.error || "회원가입에 실패했습니다.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center text-white max-w-7xl m-auto min-h-[748px] h-[calc(100vh-168px)] my-10">
      <div className="flex flex-col items-center justify-center w-full max-w-xl gap-8 bg-white/5 backdrop-blur-lg p-10 rounded-lg border-[1px] border-white/10">
        {isSuccess ? (
          <SignupSuccess isSuccess={isSuccess} />
        ) : (
          <SignupForm
            form={form}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
            isFormValid={isFormValid()}
          />
        )}
      </div>
    </div>
  );
}
