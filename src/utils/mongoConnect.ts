import mongoose from "mongoose";
// import config from "../config/configLocal";

class DbClass {
  dbConnection = async () => {
    // let url = process.env.DBNAME;
    let options: any = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
    };
    const connect = await mongoose.connect('mongodb://localhost:27017/usersdb', options);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });
    mongoose.set("strictQuery", false);
  };
}

export default new DbClass();
