import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.CONN_STRING, {
      tls: true,
       tlsAllowInvalidCertificates: false,
    });

    console.log("✅ DB connection successful");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
}

export default connectDB;
