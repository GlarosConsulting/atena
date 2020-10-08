export default interface ICreateUserDTO {
  name: string;
  email: string;
  username: string;
  password: string;
  referred_by_id?: string;
}
