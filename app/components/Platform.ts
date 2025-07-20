export const platformMapping = {
  netflix: "/assets/images/netflix.png",
  disney: "/assets/images/disney-plus.svg",
  tving: "/assets/images/tving.png",
  wavve: "/assets/images/wavve.png",
  watcha: "/assets/images/watcha.png",
  appletv: "/assets/images/apple-tv.png",
} as const;

export type PlatformType = keyof typeof platformMapping;

// OTT 제공자 이름을 플랫폼 키로 매핑하는 함수
export const mapOttProviderToPlatform = (
  provider: string
): PlatformType | null => {
  const providerLower = provider.toLowerCase();

  if (providerLower.includes("netflix")) return "netflix";
  if (providerLower.includes("disney") || providerLower.includes("disney+"))
    return "disney";
  if (providerLower.includes("tving")) return "tving";
  if (providerLower.includes("wavve")) return "wavve";
  if (providerLower.includes("watcha")) return "watcha";
  if (providerLower.includes("apple") || providerLower.includes("appletv"))
    return "appletv";

  return null;
};

// OTT 제공자 배열을 받아서 플랫폼 이미지 경로 배열을 반환하는 함수
export const getPlatformImages = (ottProviders: string[]): string[] => {
  return ottProviders
    .map((provider) => mapOttProviderToPlatform(provider))
    .filter((platform): platform is PlatformType => platform !== null)
    .map((platform) => platformMapping[platform]);
};
