/**
 * 메모리 캐시 클래스
 * 사용자별 캘린더 데이터를 캐싱하고 관리
 */
export class MemoryCache<T = unknown> {
  private cache = new Map<string, { data: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes: number = 10) {
    this.ttl = ttlMinutes * 60 * 1000; // 분을 밀리초로 변환
  }

  /**
   * 캐시에 데이터 저장
   */
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 캐시에서 데이터 조회
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // TTL 체크
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 특정 키의 캐시 삭제
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 사용자별 캐시 무효화
   */
  invalidateUserCache(userId: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
      key.startsWith(`calendar_${userId}_`)
    );

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * 캐시 키 생성 (캘린더용)
   */
  generateCalendarKey(userId: string, year: number, month: number): string {
    return `calendar_${userId}_${year}_${month}`;
  }

  /**
   * 캐시 통계
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}
