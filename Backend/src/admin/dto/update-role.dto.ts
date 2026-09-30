import { IsEnum } from 'class-validator';
import { UserRole } from '../../users/enums/user-role.enum';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
