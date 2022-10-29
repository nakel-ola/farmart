import xss from "xss";
import authenticated from "../middleware/authenticated";
import db from "../models";
import mongoose from "mongoose";

const createAddress = authenticated(async (args, req) => {
  try {
    const input = args.input,
      userId = req.userId,
      name = xss(input.name),
      street = xss(input.street),
      city = xss(input.city),
      state = xss(input.state),
      country = xss(input.country),
      info = input?.info ? xss(input?.info) : null,
      phoneNumber = xss(input.phoneNumber),
      phoneNumber2 = input?.phoneNumber2 ? xss(input?.phoneNumber2) : null;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    const newAddress = {
      name,
      street,
      city,
      state,
      country,
      info,
      phoneNumber,
      phoneNumber2,
      default: false
    };
    await db.userSchema.updateOne(
      { _id: userId },
      { $push: { addresses: newAddress } }
    );

    return { msg: "Successfully added address" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const modifyAddress = authenticated(async (args, req) => {
  try {
    const input = args.input,
      userId = req.userId,
      id = xss(input.id),
      name = xss(input.name),
      street = xss(input.street),
      city = xss(input.city),
      state = xss(input.state),
      country = xss(input.country),
      info = xss(input?.info),
      phoneNumber = xss(input.phoneNumber),
      phoneNumber2 = xss(input?.phoneNumber2);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    const newAddress = {
      "addresses.$.name": name,
      "addresses.$.street": street,
      "addresses.$.city": city,
      "addresses.$.state": state,
      "addresses.$.country": country,
      "addresses.$.info": info,
      "addresses.$.phoneNumber": phoneNumber,
      "addresses.$.phoneNumber2": phoneNumber2,
    };

    await db.userSchema.updateOne(
      { _id: userId, "addresses._id": id },
      { $set: newAddress }
    );
    return {
      msg: "Updated address",
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const addresses = authenticated(async (args, req) => {
  try {
    const userId = xss(req.userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    const data = await db.userSchema.findOne({ _id: userId }, { addresses: 1 });

    return data.addresses ?? [];
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const address = authenticated(async (args, req) => {
  try {
    const userId = xss(req.userId),
      id = xss(args.id);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID must be a valid");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    const data = await db.userSchema.findOne({ _id: userId });

    return data.addresses.find((address) => address.id === id);
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

const deleteAddress = authenticated(async (args, req) => {
  try {
    const userId = xss(req.userId),
      id = xss(args.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Product ID must be a valid");
    }

    await db.userSchema.updateOne(
      { _id: userId },
      { $pull: { addresses: { _id: id } } }
    );

    return { msg: "Deleted" };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
});

export default {
  createAddress,
  addresses,
  address,
  deleteAddress,
  modifyAddress,
};
