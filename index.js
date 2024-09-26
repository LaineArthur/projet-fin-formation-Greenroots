// Load environment variables from .env
import 'dotenv/config';

// Import NPM modules
import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

import router from './app/routers/router.js';
import { errorHandler, notFound } from './app/middlewares/errorHandlers.js';
import authMiddleware from './app/middlewares/authMiddleware.js';

// Create Express app
const app = express();

// Configure view engine
app.set("views", "./app/views");
app.set("view engine", "ejs");

// Configure assets routes (static folder)
app.use("/public", express.static("public"));

//Making parsed data available in 'req.body'
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error: ', err);
});

// Configure session store with Redis
const store = new RedisStore({
  client: redisClient
});

app.use(session({
  store,
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === "production", 
    httpOnly: true,
    maxAge: 86400000
    },
}));

app.use(authMiddleware);

//Attach all defined routes to the Express application
app.use(router);

// middleware 404
app.use(notFound);

// Error handler
app.use(errorHandler);


// Start server

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`GreenRoots app started at http://localhost:${port}`);
});