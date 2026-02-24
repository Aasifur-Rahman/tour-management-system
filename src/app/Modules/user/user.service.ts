import { StatusCodes } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import QueryBuilder from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

// here in type we used partial<IUser> cuz i user is will not be same it will take only required ones that's why it's partial here
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

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
const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([users.build(), users.getMeta()]);

  return {
    data,
    meta,
  };
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

// update user

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload,
) => {
  const ifUserExist = await User.findById(userId);

  if (!ifUserExist) {
    throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");
  }

  if (payload.role) {
    // what type of data we will update?
    /* 
   1. name, phone, password, address can be updated
   2. only admin, superadmin - role, isDeleted can be updated

   !email - cannot update
   !promoting to admin to superadmin - only superadmin can do this
  */

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError(StatusCodes.FORBIDDEN, "You are not authorized");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND,
    );
  }

  const newUpdateUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.picture && ifUserExist.picture) {
    await deleteImageFromCloudinary(ifUserExist.picture);
  }

  return newUpdateUser;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
};

// router matching (app.ts -> index.ts -> user.route.ts ) -> controller -> service -> model -> DB
