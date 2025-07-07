export type Role = "user" | "admin";

export class User {
  constructor(
    // public user_id: string,
    public name: string,
    public login_id: string,
    public password: string,
    public nickname: string | null,
    public profile_image: string | null,
    public role: Role // public created_at: string
  ) {}
}
