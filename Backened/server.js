const app = require("./index");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is ready on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => {
    console.log(err);
  });
