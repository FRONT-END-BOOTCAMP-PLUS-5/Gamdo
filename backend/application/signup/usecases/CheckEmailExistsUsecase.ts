import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";

export class CheckEmailExistsUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(loginId: string): Promise<boolean> {
    return this.userRepository.isEmailExists(loginId);
  }
}
