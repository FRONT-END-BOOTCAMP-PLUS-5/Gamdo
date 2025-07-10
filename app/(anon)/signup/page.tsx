"use client";

export default function SignupPage() {
  const handleSignup = async () => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        name: "테스트유저02",
        // loginId: "test" + Math.floor(Math.random() * 10000) + "@example.com",
        loginId: "test02@example.com",
        password: "testpassword123!",
        nickname: "test02",
        profileImage: null,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  const handleEmailCheck = async () => {
    const response = await fetch("/api/signup/email-exists", {
      method: "POST",
      body: JSON.stringify({ loginId: "test1531@example.com" }),
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

  const handleSignin = async () => {
    const response = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify({
        loginId: "test01@example.com",
        password: "testpassword123!",
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <button onClick={handleSignup}>회원가입 테스트 버튼</button>
      <br />
      <button onClick={handleEmailCheck}>이메일 중복 테스트 버튼</button>
      <br />
      <button onClick={handleNicknameCheck}>닉네임 중복 테스트 버튼</button>
      <br />
      <button onClick={handleSignin}>로그인 테스트 버튼</button>
      <br />
    </div>
  );
}
