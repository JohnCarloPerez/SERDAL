export interface UserForm {
  Id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  repassword: string;
  university: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  Password: string;
  IsActive: number;
  role: string;
  img: string;
  createDateTime: string;
  modifiedDateTime: string;
  ModifiedBy: number;
  university: number;
}

