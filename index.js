import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import movieSchema from "./schemas/schema.js";
import movieResolvers from "./resolvers/resolvers.js";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Validate required env vars
const requiredEnv = ["PORT", "DB_NAME", "DB_USER_NAME", "DB_PASSWORD", "CLUSTER_ID"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

// MongoDB Atlas connection string
const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER_NAME}:${encodeURIComponent(
  process.env.DB_PASSWORD
)}@cluster0.${process.env.CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ Unable to connect to DB:", error.message);
    process.exit(1);
  }
};

async function startServer() {
  try {
    // 1) Connect DB first
    await connectDB();

    // 2) Create Apollo Server
    const server = new ApolloServer({
      typeDefs: movieSchema,
      resolvers: movieResolvers,
    });

    // 3) Start Apollo Server
    await server.start();

    // 4) Mount GraphQL endpoint
    app.use("/graphql", expressMiddleware(server));

    // 5) Start Express server
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();