import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import router from './app/routers/router.js';
import { errorHandler, notFound } from './app/middlewares/errorHandlers.js';
import authMiddleware from './app/middlewares/authMiddleware.js';

// Create Express app
const app = express();
app.set('trust proxy', 1);


// Configure view engine
app.set("views", "./app/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Redis client and store setup
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
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(authMiddleware);

app.use(router);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
