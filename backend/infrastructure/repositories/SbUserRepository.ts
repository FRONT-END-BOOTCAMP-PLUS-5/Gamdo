// backend/infrastructure/SbUserRepository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

export class SbUserRepository implements UserRepository {
  constructor(private supabase: SupabaseClient) {}

  // 로그인 아이디 중복 체크
  async isLoginIdDuplicated(login_id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("users")
      .select("user_id")
      .eq("login_id", login_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  // 유저 생성
  async createUser(user: User): Promise<User> {
    console.log("유저 정보 " + user);
    const { data, error } = await this.supabase
      .from("users")
      .insert(user) // user_id, created_at 없이 insert
      .select()
      .single();
    if (error) throw new Error(error.message);
    return new User(
      data.name,
      data.login_id,
      data.password,
      data.nickname,
      data.profile_image,
      data.role
    );
  }
}
