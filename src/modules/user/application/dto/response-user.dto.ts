import { Roles } from '../../../common/enums/roles.enum';

export class ResponseUserDto {
  id: string;
  email: string;
  username: string;
  roles: Roles[];

  constructor(user: {
    id: string;
    email: string;
    username: string;
    roles: Roles[];
  }) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.roles = user.roles;
  }
}
