import express from "express";
import session, { SessionOptions } from "express-session";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import cors from "cors";
import { createClient } from "redis"
import authRouter from "./router/authRouter";
import settingsRouter from "./router/settingsRouter";
import docsRouter from "./router/docsRouter";
import { setupSwagger } from "./swagger";
const { RedisStore } = require("connect-redis")

dotenv.config();

// launching the express app
const app = express();

const allowedOrigins = [
  "http://localhost:3000", "https://test.fr" 
];

const corsOptions = {
  origin: (origin:any, callback:any) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error('SESSION_SECRET environment variable is required');
}


// const redisHost = process.env.NODE_ENV === "production" ? "redis" : "localhost";

const redisHost = "localhost" 

const redisUrl = `redis://${redisHost}:6379`;

let redisClient = createClient({
  url: redisUrl
})

redisClient.connect().catch(console.error)

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "test:sess:",
})

const sessionConfig: SessionOptions = {
  store: redisStore,
  secret: sessionSecret,
  resave: false, // Don’t set a cookie unless something is stored in the session.
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    // secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.get("/test", async (req, res) => {
  res.status(200).json("test")
})
app.use('/authentication', authRouter);
app.use('/settings', settingsRouter);
app.use('/documents', docsRouter);

setupSwagger(app);

app.listen(4000, () => {
  console.log("Listening on port 4000!");
});
