"use client";

export default function SignupPage() {
  const handleSignup = async () => {
    const response = await fetch("/api/signup", {
      method: "POST",
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={handleSignup}>회원가입 테스트 버튼</button>
    </div>
  );
}
