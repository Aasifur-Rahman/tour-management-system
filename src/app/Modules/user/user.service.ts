import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

// here in type we used partial<IUser> cuz i user is will not be same it will take only required ones that's why it's partial here
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(password as string, 10);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

// get all users
const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: { total: totalUsers },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};

// router matching (app.ts -> index.ts -> user.route.ts ) -> controller -> service -> model -> DB
