export class ResponseUserDto {
  id: string;
  email: string;
  username: string;

  constructor(user: { id: string; email: string; username: string }) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
  }
}
