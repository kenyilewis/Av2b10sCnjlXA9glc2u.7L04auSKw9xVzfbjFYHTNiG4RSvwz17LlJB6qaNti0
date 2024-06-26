export class ResponseUserDto {
  id: string;
  email: string;
  name: string;

  constructor(user: { id: string; email: string; name: string }) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
  }
}
