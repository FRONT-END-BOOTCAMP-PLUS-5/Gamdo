import { SbUserRepository } from "@/backend/infrastructure/repositories/SbUserRepository";

export class CheckEmailExistsUsecase {
  constructor(private userRepository: SbUserRepository) {}

  async execute(login_id: string): Promise<boolean> {
    return this.userRepository.isEmailExists(login_id);
  }
}
