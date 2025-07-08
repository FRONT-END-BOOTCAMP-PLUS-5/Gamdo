import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";

export class CheckNicknameExistsUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(nickname: string): Promise<boolean> {
    return this.userRepository.isNicknameExists(nickname);
  }
}
