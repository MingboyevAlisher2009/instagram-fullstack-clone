import { connect } from "mongoose";

const MongoDB = () => {
  try {
    console.log("Contect MongoDB");
    return connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("MongoDB error: " + error);
  }
};

export default MongoDB;
