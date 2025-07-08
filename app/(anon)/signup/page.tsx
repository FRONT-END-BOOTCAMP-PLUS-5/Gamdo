"use client";

export default function SignupPage() {
  const handleSignup = async () => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "테스트유저",
        login_id: "test" + Math.floor(Math.random() * 10000) + "@example.com",
        password: "testpa ssword",
        nickname: "test1111",
        profile_image: null,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleEmailCheck = async () => {
    const response = await fetch("/api/signup/email-exists", {
      method: "POST",
      body: JSON.stringify({ login_id: "test1531@example.com" }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleNicknameCheck = async () => {
    const response = await fetch("/api/signup/nickname-exists", {
      method: "POST",
      body: JSON.stringify({ nickname: "test" }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={handleSignup}>회원가입 테스트 버튼</button>
      <button onClick={handleEmailCheck}>이메일 중복 테스트 버튼</button>
      <button onClick={handleNicknameCheck}>닉네임 중복 테스트 버튼</button>
    </div>
  );
}
