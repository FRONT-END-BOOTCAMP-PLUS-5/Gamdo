import AiWeatherTest from "../components/AiWeatherTest";

export default function AiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🤖 AI 날씨 기반 영화 추천 테스트
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <AiWeatherTest />
        </div>
      </div>
    </div>
  );
}
