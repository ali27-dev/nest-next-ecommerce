import { Role } from '@prisma/client';

export class AuthResponseDto {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  accessToken: String;

  refreshToken: string;

  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
  };
}
