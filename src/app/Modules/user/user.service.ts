import { IUser } from "./user.interface";
import { User } from "./user.model";

// here in type we used partial<IUser> cuz i user is will not be same it will take only required ones that's why it's partial here
const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;
  const user = await User.create({
    name,
    email,
  });

  return user;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({});

  return users;
};

export const UserServices = {
  createUser,
  getAllUsers,
};

// router matching (app.ts -> index.ts -> user.route.ts ) -> controller -> service -> model -> DB
