const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    // password: { type: String, required: true },
    password: {
      type: String,
      required: true,
      select: false,
      min: [6, "Please Enter minimum 6 characters"],
    },
    picture: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dygolqxi7/image/upload/v1686410834/texto/avatar_p00iqr.png",
      },
      publicId: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     // password: { type: String, required: true },
//     password: { type: String, required: true, select: false },
//     picture: {
//       type: String,
//       default:
//         "https://images.pexels.com/photos/7562313/pexels-photo-7562313.jpeg?auto=compress&cs=tinysrgb&h=204&fit=crop&w=228&dpr=1",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPass) {
  const isPassMatched = await bycrypt.compare(enteredPass, this.password);
  return isPassMatched;
};

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;
