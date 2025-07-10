import { SupabaseClient } from "@supabase/supabase-js";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { User } from "../../domain/entities/User";

export class SbUserRepository implements UserRepository {
  constructor(private supabase: SupabaseClient) {}

  // 로그인 아이디 중복 체크
  async isEmailExists(login_id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("users")
      .select("user_id")
      .eq("login_id", login_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  // 닉네임 중복 체크
  async isNicknameExists(nickname: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("users")
      .select("user_id")
      .eq("nickname", nickname)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return !!data;
  }

  // 유저 생성
  async createUser(user: User): Promise<User> {
    const { data, error } = await this.supabase
      .from("users")
      .insert(user)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return new User(
      data.name,
      data.login_id,
      data.password,
      data.nickname,
      data.profile_image,
      data.role,
      data.user_id,
      data.created_at
    );
  }

  // login_id로 유저 조회
  async getUserByLoginId(login_id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select()
      .eq("login_id", login_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return new User(
      data.name,
      data.login_id,
      data.password,
      data.nickname,
      data.profile_image,
      data.role,
      data.user_id,
      data.created_at
    );
  }

  // user_id로 유저 조회
  async getUserByUserId(user_id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select()
      .eq("user_id", user_id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return new User(
      data.name,
      data.login_id,
      data.password,
      data.nickname,
      data.profile_image,
      data.role,
      data.user_id,
      data.created_at
    );
  }
}
