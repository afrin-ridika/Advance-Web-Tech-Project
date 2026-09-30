import { Request } from 'express';
import { UserRole } from '../../users/enums/user-role.enum';

export interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    role: UserRole;
  };
}
