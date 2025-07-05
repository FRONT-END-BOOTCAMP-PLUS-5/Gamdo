import { createClient } from "@supabase/supabase-js";

// .env 파일에서 환경 변수 불러오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

// GET 메서드 핸들러로 변경
export async function GET() {
  // 예시: 실제 존재하는 테이블(예: 'users')에서 데이터 1개 가져오기
  const { data, error } = await supabase.from("users").select("*").limit(1);

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } else {
    return Response.json({ success: true, data }, { status: 200 });
  }
}
