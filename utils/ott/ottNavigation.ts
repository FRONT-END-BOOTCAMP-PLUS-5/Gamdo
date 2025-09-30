/**
 * 플랫폼별 URL을 생성하는 함수
 * @param imagePath 플랫폼 이미지 경로
 * @param movieTitle 영화 제목 (선택사항)
 * @returns 플랫폼별 URL
 */
export const getPlatformUrl = (
  imagePath: string,
  movieTitle?: string
): string => {
  if (imagePath.includes("netflix")) {
    const encodedTitle = movieTitle ? encodeURIComponent(movieTitle) : "";
    return `https://www.netflix.com/search?q=${encodedTitle}`;
  }
  if (imagePath.includes("disney")) return "https://www.disneyplus.com";
  if (imagePath.includes("tving")) return "https://www.tving.com";
  if (imagePath.includes("wavve")) return "https://www.wavve.com";
  if (imagePath.includes("watcha")) return "https://watcha.com";
  if (imagePath.includes("appletv")) return "https://tv.apple.com";
  return "#";
};

/**
 * 플랫폼 클릭 핸들러
 * @param imagePath 플랫폼 이미지 경로
 * @param movieTitle 영화 제목 (선택사항)
 */
export const handlePlatformClick = (imagePath: string, movieTitle?: string) => {
  const url = getPlatformUrl(imagePath, movieTitle);
  if (url !== "#") {
    window.open(url, "_blank");
  }
};
