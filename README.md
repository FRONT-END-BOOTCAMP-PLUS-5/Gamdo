# Gamdo

감정의 온도: 감도
<img width="880" height="1500" alt="메인홈 - 추천페이지" src="https://github.com/user-attachments/assets/3d46a100-3699-4240-a99f-70240211a242" />


# 코드 컨벤션

변수명, 함수명 -> CamelCase
CSS -> hypon

# PR 컨벤션

feat: 새로운 기능 추가 <br >
fix: 버그 수정<br >
docs: 문서 수정<br >
style: 코드 스타일 변경 (코드 포매팅, 세미콜론 누락 등)<br >
design: 사용자 UI 디자인 변경 (CSS 등)<br >
test: 테스트 코드, 리팩토링 (Test Code)<br >
refactor: 리팩토링 (Production Code)<br >
build: 빌드 파일 수정<br >
ci: CI 설정 파일 수정<br >
perf: 성능 개선<br >
chore: 자잘한 수정이나 빌드 업데이트<br >
rename: 파일 혹은 폴더명을 수정만 한 경우<br >
remove: 파일을 삭제만 한 경우<br >

# 시스템 설계

회원 등록 시스템 - 소연<br >
: 회원정보를 db에 저장<br >

영화 조회 시스템 - 동우<br >
: tmdb에서 제목, 감독 등을 이용해 영화 리스트 반환<br >

영화 저장 시스템<br >
: 사용자, 영화id, 날짜를 저장하고, 포스터이미지까지 받아오기<br >

영화 리뷰등록 시스템 - 지나<br >
: 사용자, 영화, 한줄평내용, timestamp 저장하기<br >

영화 찜하기 시스템<br >
: 사용자, 영화, 추천 여부 저장<br >

영화 추천 시스템 - 정훈<br > 0) 날씨 데이터<br >

1. 사용자가 원하는 조건데이터 받기<br >
2. 해당 값을 gpt에 보내기<br >
3. 반환된 영화 정보를 이용해 tmdb에 영화 정보 얻어오기<br >

## 후순위

: 플랫폼 구독 관리 (후순위)<br >

회원 관리 시스템 (후순위)<br >
: 관리자가 회원을 조회, 수정, 삭제<br >

mdPick 영상 등록 시스템 (후순위)<br >
: 우선 db에 박기 <br >

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
