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

feature/ ...

회원 등록 시스템(feature/signin) - 소연<br >
: 회원정보를 db에 저장
feature/user
: signin에서 파생함. user와 관련된 정보<br >

영화 조회 시스템(feature/search) - 지나<br >
: tmdb에서 제목, 감독 등을 이용해 영화 리스트 반환<br >

영화 저장 시스템<br >(feature/save) - 정훈
: 사용자, 영화id, 날짜를 저장하고, 포스터이미지까지 받아오기<br >

영화 리뷰등록 시스템(feature/review) - 지나<br >
: 사용자, 영화, 한줄평내용, timestamp 저장하기<br >

영화 찜하기 시스템(feature/favorite-movie)<br > - 동우
: 사용자, 영화, 추천 여부 저장<br >

영화 추천 시스템(feature/recommender) - 정훈<br >
: DB에 저장하는 부분은 없음.
: 기상청 API 파싱
: 추천페이지 내 사용자의 감정, 장르, 시간정보 zustand에 저장`
: 프롬프트 및 Gemini AI 연동
: 리턴된 영화 포스터 보여주기

# UI 퍼블리싱

design/ ...

영화 추천 페이지 - 정훈
영화 상세 페이지 - 지나
영화 검색 페이지 - 소연
헤더,푸터 - 소연
로그인,회원가입 - 소연
마이페이지 - 동우

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
