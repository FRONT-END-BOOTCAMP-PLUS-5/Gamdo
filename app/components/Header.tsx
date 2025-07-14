import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full h-11 bg-gradient-to-b from-black to-[#1D1F28]">
      <div className="h-full flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/logo.svg"
            alt="로고"
            width={130}
            height={32}
            className="mr-10"
          />
          <nav className="flex-1 flex justify-center gap-8 text-sm text-gray-200">
            <a href="#" className="hover:text-white">
              추천
            </a>
            <a href="#" className="hover:text-white">
              검색
            </a>
          </nav>
        </div>

        <div>
          <Image
            src="/assets/icons/profile.svg"
            alt="프로필"
            width={24}
            height={24}
          />
        </div>
      </div>
    </header>
  );
}
