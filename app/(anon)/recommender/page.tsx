import { SiCoffeescript } from "react-icons/si";

const RecommenderPage = () => {
  return (
    // 전체 wrap
    <div className="flex flex-col">
      {/* 상단텍스트 + 사용자 정보 카테고리 감싸는 div */}
      <div className="flex flex-col w-4/5 h-screen mx-auto border-2 border-blue-500">
        {/* 취향에 딱 맞춘 영화 */}
        <div className="flex my-15 justify-center text-white text-5xl">취향에 딱 맞춘 영화를 추천해드릴게요</div>
        {/* 날씨 + 사용자 정보 감싸는 섹션 */}
        <div className="flex-1 flex-col border-2 border-red-500">
          {/* 날씨 */}
          <div className="flex h-1/2 border-2 border-green-500">
            {/* 날씨 왼쪽 섹션 */}
            <div className="flex flex-col m-5 p-10 border-2 border-blue-500 text-white">
              {/* 날씨 기본 정보 섹션 */}
              <div className="flex-1 mb-5 pt-10">
                <span className="flex justify-center text-5xl">25°</span>
                <span className="flex justify-center text-1xl mt-2">서울특별시 구로구</span>
              </div>
              {/* 날씨 각종 정보 섹션 */}
              <div className="flex ">
                <div className="flex flex-col justify-center pr-5 border-r-2 border-white-100">
                  <span>최고온도 30°</span>
                  <span>최저온도 20°</span>
                  <span>체감온도 25°</span>
                </div>
                <div className="flex flex-col pl-5">
                  <span>습ㅤㅤ도 50%</span>
                  <span>강ㅤㅤ수 0mm</span>
                  <span>미세먼지 좋음</span>
                </div>
              </div>
            </div>
            {/* 날씨 오른쪽 섹션*/}
            <div className="flex-1 m-5 border-2 border-blue-500 text-white">
              <div className="flex h-1/2 items-center px-5 text-2xl leading-loose">
                날씨에 따라 보고싶은 영화가 달라진 경험이 있으신가요?
                <br />
                선택하신 카테고리에 맞는 영화를 추천해드릴게요!
              </div>
              {/* 날씨 버튼 컴포넌트 */}
              <div className="flex h-1/2 justify-center border-2 border-yellow-500 items-center px-5 gap-2">
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">맑음</button>
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">흐림</button>
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">비</button>
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">눈</button>
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">우박</button>
                <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">안개</button>
              </div>
            </div>
          </div>
          {/* 사용자 정보 */}
          <div className="flex h-1/2 border-2 text-white text-2xl border-yellow-500">
            {/* 여기서부터 유저 정보선택 컴포넌트 */}
            {/* 차후에 시간되면 컴포넌트 분리하여 map으로 돌릴것 */}
            <div className="flex-1 flex-col m-5 p-5 border-2 border-red-500">
              <div className="inline-flex justify-center items-center bg-[#DEFFFD] rounded-xl size-12">
                <SiCoffeescript color="4BBEAB" size={28} />
              </div>
              <div className="mt-5 pl-1 pb-4 border-b-2 border-white">감정</div>
              {/* 7.17여기부터 */}
              <button className="border-2 border-white rounded-lg px-4 py-2 hover:cursor-pointer">안개</button>
            </div>
            <div className="flex-1 flex-col m-5 p-5 border-2 border-red-500">장르</div>
            <div className="flex-1 flex-col m-5 p-5 border-2 border-red-500">시간</div>
          </div>
        </div>
      </div>
      {/* 영화 정보 나타내는 */}
      <div className="h-screen border-2 border-red-500"></div>
    </div>
  );
};

export default RecommenderPage;
