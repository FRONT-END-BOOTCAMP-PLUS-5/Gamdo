import GeminiWeatherComponent from "../../backend/application/recommender/GeminiWeatherComponent";

export default function GeminiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🤖 Gemini 날씨 기반 영화 추천 테스트
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <GeminiWeatherComponent />
        </div>
      </div>
    </div>
  );
}
