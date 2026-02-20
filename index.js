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

// Optional: apply globally (keeps /graphql middleware shorter)
app.use(cors());
app.use(express.json());

// Validate env (prevents silent undefined issues)
const requiredEnv = ["DB_USER_NAME", "DB_PASSWORD", "CLUSTER_ID", "DB_NAME", "PORT"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.${process.env.CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

async function connectDB() {
  await mongoose.connect(DB_CONNECTION);
  console.log("✅ Connected to MongoDB Atlas");
}

async function startServer() {
  try {
    await connectDB();

    const server = new ApolloServer({
      typeDefs: movieSchema,
      resolvers: movieResolvers,
    });

    await server.start();

    app.use("/graphql", expressMiddleware(server));

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
}

startServer();