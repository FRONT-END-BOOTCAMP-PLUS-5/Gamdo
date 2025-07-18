import { SubmitButton } from "@/app/components";

interface SignupFormProps {
  form: {
    name: string;
    loginId: string;
    password: string;
    check_password: string;
    nickname: string;
  };
  errors: {
    name: string;
    loginId: string;
    password: string;
    check_password: string;
    nickname: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
  isFormValid: boolean;
}

export default function SignupForm({
  form,
  errors,
  handleChange,
  handleSubmit,
  error,
  loading,
  isFormValid,
}: SignupFormProps) {
  return (
    <>
      <h1 className="text-2xl font-bold">Sign Up</h1>
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
            maxLength={10}
            className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
            required
          />
          <div className="w-full h-4 py-1 text-sm">
            <div className="text-red-400">{errors.name}</div>
          </div>
        </div>
        <div>
          <label htmlFor="loginId" className="text-white block mb-2">
            이메일
          </label>

          <input
            id="loginId"
            name="loginId"
            type="email"
            placeholder="gmado@example.com"
            value={form.loginId}
            onChange={handleChange}
            className="bg-[#DEFFFD] border border-gray-300 text-gray-900 text-sm rounded-[24px] focus:outline-[#4BBEAB] focus:border-[#56EBE1] block w-full p-2.5"
            required
            maxLength={40}
          />

          <div className="w-full h-4 py-1 text-sm">
            <div className="text-red-400">{errors.loginId}</div>
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
            maxLength={40}
          />
          <div className="w-full h-4 py-1 text-sm">
            <div className="text-red-400">{errors.password}</div>
          </div>
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
            maxLength={40}
          />
          <div className="w-full h-4 py-1 text-sm">
            <div className="text-red-400">{errors.check_password}</div>
          </div>
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
            maxLength={10}
          />
          <div className="w-full h-4 py-1 text-sm">
            <div className="text-red-400">{errors.nickname}</div>
          </div>
        </div>

        <SubmitButton
          loading={loading}
          text="회원가입"
          type="submit"
          disabled={!isFormValid}
        />
      </form>
      <div className="w-full h-4">
        {error && <div className="text-red-400 text-center">{error}</div>}
      </div>
    </>
  );
}
