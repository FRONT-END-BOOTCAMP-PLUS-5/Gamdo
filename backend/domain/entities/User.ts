export type Role = "user" | "admin";

export class User {
  constructor(
    public name: string,
    public login_id: string,
    public password: string,
    public nickname: string,
    public profile_image: string | null,
    public role: Role,
    public user_id?: string,
    public created_at?: string
  ) {}
}
