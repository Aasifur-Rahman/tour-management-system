import { Types } from "mongoose";

export enum Role {
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

// auth providers
/* 
1. email password,
2. Google authentication
*/

export interface IAuthProvider {
  provider: string; // "Google", "Credential"
  providerId: string; // "d23123123fswd3"
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: string;
  role: Role;
  //   auths will keep how user logged in
  // why here is array?
  /* 
user can login with email pass or google login 
if the user decides to use google login then we will get that email 
and user also may have this same email as there credential account so for that reason
having 2 of these that's why we are keeping this interface as in array
*/
  auths: IAuthProvider[];

  //   for keeping user bookings
  //  for booking we will create a collection and we will store the data of
  // per user bookings in an Array same goes for guides so those is will be stored in here
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
