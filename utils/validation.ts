// 회원가입 입력값 유효성 검사 함수 모음

// 1. 이름: 한글, 영어, 숫자, 공백만 허용, 한글 자음/모음 분리 불가
export function validateName(name: string): boolean {
  // 한글(완성형), 영어, 숫자, 공백만 허용, 10자 이내
  const regex = /^[A-Za-z0-9\uAC00-\uD7A3 ]+$/;
  return regex.test(name) && name.length <= 10;
}

// 2. 이메일 형식
export function validateEmail(email: string): boolean {
  // 간단한 이메일 정규식
  const regex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;
  return regex.test(email);
}

// 3. 비밀번호: 숫자, 특수문자, 영어 대소문자만 허용
export function validatePassword(password: string): boolean {
  // 허용 특수문자: !@#$%^&*()_-+=[]{};:'",.<>/?\|
  // 8자 이상, 영문/숫자/특수문자 조합
  const regex = /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|]+$/;
  if (!regex.test(password) || password.length < 8) return false;
  // 영문, 숫자, 특수문자 각각 1개 이상 포함
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|]/.test(password);
  return hasLetter && hasNumber && hasSpecial;
}

// 4. 닉네임: 공백 불가, 한글/영문/숫자/특수문자만 허용
export function validateNickname(nickname: string): boolean {
  // 한글(완성형), 영어, 숫자, 허용 특수문자, 공백 불가, 8자 이내
  const regex = /^[A-Za-z0-9\uAC00-\uD7A3!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|]+$/;
  return regex.test(nickname) && nickname.length <= 8;
}
