import mongoose from "mongoose";
require("dotenv").config();

try {
  mongoose.connect(`${process.env.DB_URI}`);

  const db = mongoose.connection;

  db.on("error", (error) => {
    console.error("DB connection error:", error);
    throw new Error("DB connection failed");
  });

  db.once("open", () => {
    console.log("DB connected successfully");
  });
} catch (error) {
  console.error("DB connection error:", error);
  throw new Error("DB connection failed");
}
