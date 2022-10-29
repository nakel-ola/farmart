import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import { merge } from "lodash";
import mongoose from "mongoose";
import { v4 } from "uuid";
import xss from "xss";
import config from "../config";
import db from "../models";
import type { Upload } from "graphql-upload-minimal";
import ImageUplaod from "../helper/ImageUpload";
import authenticated from "../middleware/authenticated";
import type { ReqBody } from "../typing";
import type { LoginArgs,ForgetPasswordArgs,ChangePasswordArgs, ValidationTokenType, UpdatePasswordArgs } from "../typing/employee";
import { nanoidV2 } from "../helper";
import type { BlockUserArgs, ModifyUserArgs, RegisterArgs, UserDataType, UsersArgs, UserType } from "../typing/auth";
import type { Msg } from "../typing/custom";

const register = async (args: RegisterArgs, req: ReqBody): Promise<UserType> => {
  try {
    let name = xss(args.input.name),
      email = xss(args.input.email),
      phoneNumber = xss(args.input.phoneNumber),
      password = xss(args.input.password);

    const user = await db.userSchema.findOne({ email }, { email: 1 });

    if (user) {
      throw new Error(`User ${user.email} already exists`);
    }

    const salt = genSaltSync(config.saltRounds),
      hash = hashSync(password, salt);

    let obj = {
      name,
      email,
      phoneNumber,
      password: hash,
      gender: null,
      photoUrl: null,
      birthday: null,
      addresses: [],
      blocked: false,
    };

    const newUser = await db.userSchema.create(obj);

    const token = jwt.sign(
      { id: (newUser as any)._id.toString(), blocked: false },
      config.jwt_key,
      { expiresIn: config.expiresIn }
    );

    (req.session as any).grocery = token;
    return merge(
      { __typename: "User" },
      {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        gender: newUser.gender,
        birthday: newUser.birthday,
        phoneNumber: newUser.phoneNumber,
        photoUrl: newUser.photoUrl,
        createdAt: (newUser as any).createdAt,
        updatedAt: (newUser as any).updatedAt,
        blocked: newUser.blocked,
      }
    );
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const login = async (args: LoginArgs, req: ReqBody): Promise<UserType> => {
  try {
    let email = xss(args.input.email),
      password = xss(args.input.password);

    const user = await db.userSchema.findOne({ email });

    if (!user) {
      throw new Error("Something went wrong");
    }

    const isPassword = compareSync(password, user.password);

    if (!isPassword) {
      throw new Error("Something went wrong");
    }

    let token = jwt.sign(
      {
        id: user._id.toString(),
        blocked: user.blocked,
      },
      config.jwt_key,
      { expiresIn: config.expiresIn }
    );

    (req.session as any).grocery = token;

    return merge({ __typename: "User" }, user);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const forgetPassword = async (args: ForgetPasswordArgs): Promise<ValidationTokenType> => {
  try {
    let name = xss(args.input.name),
      email = xss(args.input.email);

    let id = nanoidV2("0123456789",5);

    const user = await db.userSchema.findOne({ email, name });

    if (!user) {
      throw new Error("User not found");
    }

    let obj = {
      name,
      email,
      validationToken: id,
      expiresIn: Date.now,
    };

    await db.validateSchema.create(obj);

    return { validationToken: id };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const changePassword = async (args: ChangePasswordArgs, req: ReqBody): Promise<UserType> => {
  try {
    let name = xss(args.input.name),
      email = xss(args.input.email),
      password = xss(args.input.password),
      validationToken = xss(args.input.validationToken);

    const validate = await db.validateSchema.findOne({
      email,
      name,
      validationToken,
    });

    if (!validate) {
      throw new Error("Something want wrong");
    }

    const salt = genSaltSync(config.saltRounds);

    const hash = hashSync(password, salt);

    const user = await db.userSchema.updateOne(
      { email, name },
      { password: hash }
    );

    if (!user) {
      throw new Error("Something went wrong");
    }

    const newUser = await db.userSchema.findOne({ email });

    if (!newUser) {
      throw new Error("Something went wrong");
    }

    const token = jwt.sign(
      { id: newUser._id, blocked: newUser.blocked },
      config.jwt_key,
      { expiresIn: config.expiresIn }
    );

    (req.session as any).grocery = token;

    await db.validateSchema.deleteOne({ email, name });

    return merge({ __typename: "User", newUser });
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const modifyUser = authenticated(async (args: ModifyUserArgs, req: ReqBody): Promise<Msg> => {
  try {
    let userId = xss(req.userId),
      input = args.input,
      email = xss(input.email),
      name = xss(input.name),
      gender = input.gender ? xss(input.gender) : null,
      birthday = input.birthday ? xss(input.birthday) : null,
      phoneNumber = input.phoneNumber ? xss(input.phoneNumber) : null;

    const user = await db.userSchema.updateOne(
      { _id: userId, email },
      { name, gender, birthday, phoneNumber }
    );

    if (!user) {
      throw new Error("Something went wrong");
    }
    return { msg: "Successfully updated" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const updatePassword = authenticated(async (args: UpdatePasswordArgs, req: ReqBody): Promise<UserType> => {
  try {
    let userId = xss(req.userId),
      input = args.input,
      email = xss(input.email),
      oldPassword = xss(input.oldPassword),
      newPassword = xss(input.newPassword);

    const user = await db.userSchema.findOne({ _id: userId, email });

    if (!user) {
      throw new Error("Something went wrong");
    }

    const isPassword = compareSync(oldPassword, user.password);

    if (!isPassword) {
      throw new Error("Something went wrong");
    }

    const salt = genSaltSync(config.saltRounds);

    const hash = hashSync(newPassword, salt);

    const newUser = await db.userSchema.updateOne(
      { _id: userId, email },
      { password: hash }
    );

    if (!newUser) {
      throw new Error("Something went wrong");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email, photoUrl: user.photoUrl },
      config.jwt_key,
      { expiresIn: config.expiresIn }
    );

    (req.session as any).grocery = token;

    return merge({ __typename: "User" }, user);
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
});

const user = authenticated(async (args: { customerId?: string }, req: ReqBody): Promise<UserType> => {
  try {
    let userId = req.userId,
      admin = req.admin,
      customerId = args.customerId;
    if (!mongoose.Types.ObjectId.isValid(customerId ?? userId)) {
      throw new Error("No such user");
    }

    if (customerId && !admin) {
      throw new Error("You don't have permission to acccess this user");
    }

    const user = await db.userSchema.findOne(
      { _id: customerId ?? userId },
      {
        birthday: 1,
        email: 1,
        gender: 1,
        name: 1,
        phoneNumber: 1,
        photoUrl: 1,
        blocked: 1,
        updatedAt: 1,
        createdAt: 1,
      }
    );
    if (!user) {
      throw new Error("Something went wrong");
    }
    return merge({ __typename: "User" }, user);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const users = authenticated(async (args: UsersArgs, req: ReqBody): Promise<UserDataType> => {
  try {
    let isAdmin = req.admin,
      admin = Boolean(xss(`${args.input.admin}`)),
      page = Number(xss(`${args.input.page ?? 1}`)),
      limit = Number(xss(`${args.input.limit ?? 10}`)),
      start = (page - 1) * limit,
      end = limit + start;

    if (!isAdmin) {
      throw new Error("Can't get any users for you");
    }

    const newUser = await db.userSchema.find(
      { admin },
      {
        birthday: 1,
        email: 1,
        gender: 1,
        name: 1,
        phoneNumber: 1,
        photoUrl: 1,
        blocked: 1,
        updatedAt: 1,
        createdAt: 1,
      }
    );

    return {
      __typename: "UsersData",
      page,
      totalItems: newUser.length,
      results: newUser.slice(start, end) as any,
    };
  } catch (e) {
    console.log(e);
  }
});

const blockUser = authenticated(async (args: BlockUserArgs, req: ReqBody): Promise<Msg> => {
  try {
    let admin = req.admin,
      customerId = xss(args.input.customerId),
      email = xss(args.input.email),
      blocked = Boolean(xss(`${args.input.blocked}`));
    if (!admin) {
      throw Error("You don't have permission to block this user");
    }

    const user = await db.userSchema.updateOne(
      { _id: customerId, email },
      { blocked }
    );

    if (!user) {
      throw new Error("Something went wrong");
    }
    return { msg: "User Blocked successfully" };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

const updatePhotoUrl = authenticated(
  async (args: { image: Upload }, req: ReqBody) => {
    try {
      let userId = req.userId,
        image = args.image;

      const newImage = await ImageUplaod(image.file);

      await db.userSchema.updateOne(
        { _id: userId },
        {
          photoUrl: newImage.url,
        }
      );

      return {
        msg: "PhotoUrl updated successfully",
      };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

export default {
  register,
  login,
  forgetPassword,
  changePassword,
  updatePassword,
  modifyUser,
  user,
  users,
  blockUser,
  updatePhotoUrl,
};
