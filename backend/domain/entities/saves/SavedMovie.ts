/**
 * 저장된 영화 정보 엔티티 (수파베이스 calendar 테이블)
 */
export class SavedMovie {
  constructor(
    public userId: string, // user_id 컬럼
    public movieId: string, // movie_id 컬럼
    public savedAt: string // saved_at 컬럼 (YYYY-MM-DD 형식)
  ) {}
}
