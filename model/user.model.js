const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  },
  {
    timestamps: true,
  }
);

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
