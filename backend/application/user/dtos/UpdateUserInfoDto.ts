export class UpdateUserInfoDto {
  constructor(
    public userId: string,
    public nickname: string,
    public password: string
  ) {}
}
