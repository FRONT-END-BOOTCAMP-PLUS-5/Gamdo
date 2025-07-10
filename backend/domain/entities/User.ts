export type Role = "user" | "admin";

export class User {
  constructor(
    public name: string,
    public loginId: string,
    public password: string,
    public nickname: string,
    public profileImage: string | null,
    public role: Role,
    public userId?: string,
    public createdAt?: string
  ) {}
}
