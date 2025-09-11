const app = require("./index");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/coding_platform")
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
