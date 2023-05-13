const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`server is ok and running on port: ${port}`);
});
