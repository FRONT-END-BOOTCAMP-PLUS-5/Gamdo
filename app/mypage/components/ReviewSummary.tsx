interface Review {
    movie: string;
    date: string;
    content: string;
  }
  
  const dummyReviews: Review[] = [
    {
      movie: '인터스텔라',
      date: '2025.06.30',
      content: '우주는 넓고 우리는 작다.',
    },
    {
      movie: '악마는프라다를입는다',
      date: '2025.06.20',
      content: '앤해서웨이가 예뻐요.',
    },
    {
      movie: '인사이드아웃',
      date: '2025.06.20',
      content: '이 영화는 인생영화예요. 주기적으로 봐줘야 함',
    },
  ];
  
  
    export default function ReviewSummary() {
      return (
        <div className="mb-2 w-[470px] h-[286px]">
          {/* 한줄평 헤더 (박스 밖) */}
          <div className="flex justify-between items-center mb-2 px-1 w-full">
            <span className="text-white text-[24px] font-medium">한줄평 ({dummyReviews.length})</span>
            <button className="text-white text-base font-light">더보기</button>
          </div>
          {/* 한줄평 박스 */}
          <div className="bg-[#17181d] rounded-xl p-6">
            <ul>
              {dummyReviews.map((review, idx) => (
                <li key={idx} className="mb-6">
                  <div className="text-gray-200 text-[15px] font-semibold">
                    {review.movie} <span className="mx-1">|</span> {review.date}
                  </div>
                  <div className="text-white text-[18px] mt-1 leading-[140%] text-left w-[355.16px] h-[35.4px]">
                    {review.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
   
  