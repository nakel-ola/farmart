import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import type { Upload } from "graphql-upload-minimal";
import jwt from "jsonwebtoken";
import { merge } from "lodash";
import mongoose from "mongoose";
import { v4 } from "uuid";
import xss from "xss";
import config from "../config";
import { invitationMail, passwordChangeMail, verificationMail } from "../data/emailData";
import { nanoid } from "../helper";
import clean from "../helper/clean";
import emailer from "../helper/emailer";
import generateCode from "../helper/generateCode";
import ImageUplaod from "../helper/ImageUpload";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { ReqBody } from "../typing";
import type { ErrorMsg, Msg } from "../typing/custom";
import type {
  ChangePasswordArgs,
  CreateEmployeeInviteArgs,
  EmployeesArgs,
  EmployeesDataType,
  EmployeeTypes,
  ForgetPasswordArgs,
  LoginArgs,
  ModifyUserArgs,
  TokenType,
  UpdatePasswordArgs,
  ValidationTokenType
} from "../typing/employee";

const employeeRegister = async (
  args,
  req: ReqBody,
  res,
  context,
  info
): Promise<EmployeeTypes> => {
  try {
    let name = xss(args.input.name),
      email = xss(args.input.email),
      phoneNumber = xss(args.input.phoneNumber),
      inviteCode = xss(args.input.inviteCode),
      password = xss(args.input.password);

    const validate = await verifyInvite({ email, inviteCode });

    if (!validate) {
      throw new Error("Something went wrong");
    }

    const user = await db.employeeSchema.findOne({ email }, { email: 1 });

    if (user) {
      throw new Error(`User ${user.email} already exists`);
    }

    const salt = genSaltSync(config.saltRounds),
      hash = hashSync(password, salt);

    let obj = {
      name,
      email,
      phoneNumber,
      gender: null,
      level: validate.level,
      photoUrl: null,
      birthday: null,
      addresses: [],
      password: hash,
    };

    const newUser = await db.employeeSchema.create(obj);

    const token = jwt.sign(
      { id: (newUser as any)._id.toString(), level: validate.level },
      config.jwt_key,
      { expiresIn: config.expiresIn }
    );

    (req.session as any).auth_admin = token;

    await db.inviteSchema.updateOne(
      { _id: validate._id, email, inviteCode },
      { status: "completed" }
    );

    // await deleteEmployeeInvite(
    //   { id: validate._id.toString() },
    //   req,
    //   res,
    //   context,
    //   info
    // );

    // delete newUser["password"];

    let data = {
      __typename: "Employee",
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      gender: newUser.gender,
      birthday: newUser.birthday,
      phoneNumber: newUser.phoneNumber,
      photoUrl: newUser.photoUrl,
      createdAt: (newUser as any).createdAt,
      updatedAt: (newUser as any).updatedAt,
      level: newUser.level,
    };

    console.log(data);

    return data as any;
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

const employeeLogin = async (
  args: LoginArgs,
  req: ReqBody
): Promise<EmployeeTypes> => {
  try {
    let email = xss(args.input.email),
      password = xss(args.input.password);

    const user = await db.employeeSchema.findOne({ email });

    if (!user) {
      throw new Error("Something went wrong");
    }

    const isPassword = compareSync(password, user.password);

    if (!isPassword) {
      throw new Error("Something went wrong");
    }

    let token = jwt.sign({ id: user._id, level: user.level }, config.jwt_key, {
      expiresIn: config.expiresIn,
    });

    (req.session as any).auth_admin = token;
    console.log(req.session)

    return {
      __typename: "Employee",
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      gender: user.gender,
      birthday: user.birthday,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoUrl,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt,
      level: user.level,
    };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const employeeForgetPassword = async (
  args: ForgetPasswordArgs
): Promise<ValidationTokenType> => {
  try {
    let name = xss(args.input.name),
      email = xss(args.input.email);

    let id = generateCode(11111, 99999);

    const user = await db.employeeSchema.findOne(
      { email, name },
      { email: 1, name: 1 }
    );

    if (!user) {
      throw new Error("User not found");
    }

    let obj = {
      name,
      email,
      validationToken: id,
      expiresIn: Date.now(),
    };

    await db.validateSchema.create(obj);

    await emailer({
      from: '"Grocery Team" noreply@grocery.com',
      to: email,
      subject: "Your Grocery app verification code",
      text: null,
      html: verificationMail({ code: id, name }),
    });

    console.log(id)

    return { validationToken: id.toString() };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const employeeChangePassword = async (
  args: ChangePasswordArgs,
  req: ReqBody
): Promise<TokenType> => {
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

    const user = await db.employeeSchema.updateOne(
      { email, name },
      { password: hash }
    );

    if (!user) {
      throw new Error("Something went wrong");
    }

    const newUser = await db.employeeSchema.findOne(
      { email }
    );

    if (!newUser) {
      throw new Error("Something went wrong");
    }

    const token = jwt.sign({ id: newUser._id, ...newUser }, config.jwt_key, {
      expiresIn: config.expiresIn,
    });

    (req.session as any).auth_admin = token;

    await db.validateSchema.deleteOne({ email, name });

    await emailer({
      from: '"Grocery Team" noreply@grocery.com',
      to: email,
      subject: "Your password was changed",
      text: null,
      html: passwordChangeMail({ name, email }),
    });

    return merge({ __typename: "Employee" }, newUser) as any;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
};

const employeeUpdatePassword = authenticated(
  async (args: UpdatePasswordArgs, req: ReqBody): Promise<EmployeeTypes> => {
    try {
      let userId = xss(req.userId),
        input = args.input,
        email = xss(input.email),
        oldPassword = xss(input.oldPassword),
        newPassword = xss(input.newPassword);

      const user = await db.employeeSchema.findOne({ _id: userId, email });

      if (!user) {
        throw new Error("Something went wrong");
      }

      const isPassword = compareSync(oldPassword, user.password);

      if (!isPassword) {
        throw new Error("Something went wrong");
      }

      const salt = genSaltSync(config.saltRounds);

      const hash = hashSync(newPassword, salt);

      const newUser = await db.employeeSchema.updateOne(
        { _id: userId, email },
        { password: hash }
      );

      if (!newUser) {
        throw new Error("Something went wrong");
      }

      req.res.clearCookie("auth");


      req.session.destroy((err) => {
        if (err) {
          throw new Error(err.message);
        }
      });

      await emailer({
        from: '"Grocery Team" noreply@grocery.com',
        to: email,
        subject: "	Your password was changed",
        text: null,
        html: passwordChangeMail({ name: user.name, email }),
      });

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email,
          photoUrl: user.photoUrl,
          birthday: user.birthday,
          gender: user.gender,
          phoneNumber: user.phoneNumber,
          level: user.level,
        },
        config.jwt_key,
        { expiresIn: config.expiresIn }
      );

      (req.session as any).grocery = token;

      return {
        __typename: "Employee",
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
        level: user.level,
      };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const employeeModifyUser = authenticated(
  async (args: ModifyUserArgs, req: ReqBody): Promise<Msg> => {
    try {
      let userId = xss(req.userId),
        input = args.input,
        employeeId = xss(input.employeeId),
        email = xss(input.email),
        name = xss(input.name),
        gender = xss(input.gender),
        birthday = input.birthday,
        level = xss(input.level),
        phoneNumber = xss(input.phoneNumber);

      const user = await db.employeeSchema.updateOne(
        { _id: employeeId ?? userId, email },
        { name, gender, birthday, phoneNumber, level }
      );

      if (!user) {
        throw new Error("Something went wrong");
      }
      return { msg: "Successfully updated" };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
);

const employees = authenticated(
  async (
    args: EmployeesArgs,
    req: ReqBody
  ): Promise<EmployeesDataType | ErrorMsg> => {
    try {
      let isAdmin = req.admin,
        page = Number(xss(args.input.page.toString() ?? "1")),
        limit = Number(xss(args.input.limit.toString() ?? "10")),
        start = (page - 1) * limit,
        end = limit + start;

      if (!isAdmin) {
        throw new Error("Can't get any users for you");
      }

      const newUser = await db.employeeSchema.find(
        {},
        {
          birthday: 1,
          email: 1,
          gender: 1,
          name: 1,
          phoneNumber: 1,
          photoUrl: 1,
          level: 1,
          updatedAt: 1,
          createdAt: 1,
        }
      );

      return {
        __typename: "EmployeeData",
        page,
        totalItems: newUser.length,
        results: (newUser as any).slice(start, end),
      };
    } catch (e) {
      console.log(e);
    }
  }
);

const employee = authenticated(
  async (
    args: { employeeId?: string },
    req: ReqBody
  ): Promise<EmployeeTypes> => {
    try {
      let userId = req.userId,
        admin = req.admin,
        employeeId = args.employeeId;
      if (!mongoose.Types.ObjectId.isValid(employeeId ?? userId)) {
        throw new Error("No such user");
      }

      if (employeeId && !admin) {
        throw new Error("You don't have permission to acccess this user");
      }

      const user = await db.employeeSchema.findOne(
        { _id: employeeId ?? userId },
        {
          birthday: 1,
          email: 1,
          gender: 1,
          name: 1,
          phoneNumber: 1,
          photoUrl: 1,
          level: 1,
          updatedAt: 1,
          createdAt: 1,
        }
      );
      if (!user) {
        throw new Error("Something went wrong");
      }

      return {
        __typename: "Employee",
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        gender: user.gender,
        birthday: user.birthday,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoUrl,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
        level: user.level,
      };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
);

const updateEmployeePhotoUrl = authenticated(
  async (args: { image: Upload }, req: ReqBody): Promise<Msg> => {
    try {
      let userId = req.userId,
        image = args.image;

      const newImage = await ImageUplaod(image.file);

      await db.employeeSchema.updateOne(
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

const createEmployeeInvite = authenticated(
  async (args: CreateEmployeeInviteArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        email = xss(args.input.email),
        level = xss(args.input.level),
        inviteCode = nanoid(5),
        status = "pending";

      if (!admin) {
        throw new Error("You don't have permission to invite an employee");
      }

      let link = `${config.admin_url}/?type=sign&code=${inviteCode}`;

      await db.inviteSchema.create({ email, level, status, inviteCode });

      //  http://localhost:3001/?type=sign&code=ZSX8E

      // invitationMail

      console.log(link);

      await emailer({
        from: '"Grocery Team" noreply@grocery.com',
        to: email,
        subject: "Your Grocery app verification code",
        text: null,
        html: invitationMail({ link  }),
      });

      return { msg: "Invite sent successfully" };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const deleteEmployeeInvite = authenticated(
  async (args: { id: string }, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        id = xss(args.id);

      if (!admin) {
        throw new Error("You don't have permission");
      }

      await db.inviteSchema.deleteOne({ _id: id });
      return { msg: "Invite deleted successfully" };
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const verifyInvite = async ({
  email,
  inviteCode,
}: {
  email: string;
  inviteCode: string;
}) => {
  try {
    const data = await db.inviteSchema.findOne({ email, inviteCode });

    if (!data) {
      return false;
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};
const employeeInvites = authenticated(async (_, req: ReqBody) => {
  try {
    let admin = req.admin;
    if (!admin) {
      throw new Error("You have permission");
    }
    const data = await db.inviteSchema.find({});
    return data.map((value) => merge({ __typename: "EmployeeInvite" }, value));
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

const logout = authenticated(async (_, req: ReqBody) => {
  try {
    req.res.clearCookie(req.admin ? "auth" : "grocery");

    req.session.destroy((err) => {
      if (err) {
        throw new Error(err.message);
      }
    });

    return { msg: "Logout successful" };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

export default {
  employeeRegister,
  employeeLogin,
  employeeForgetPassword,
  employeeChangePassword,
  employeeUpdatePassword,
  employeeModifyUser,
  employees,
  employee,
  updateEmployeePhotoUrl,
  createEmployeeInvite,
  deleteEmployeeInvite,
  employeeInvites,
  logout,
};
