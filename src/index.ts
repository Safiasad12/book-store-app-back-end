import morgan from "morgan";
import express from 'express';
import dotenv from 'dotenv';
import logger from "./config/logger.config";
import connectDB from "./config/database.config";



const app = express();
dotenv.config();
connectDB();

const morganFormat = ":method :url :status :response-time ms";
const port = process.env.APP_PORT;
const host = process.env.APP_HOST;
const api_version = process.env.API_VERSION;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);


app.listen(port, () => {
  logger.info(
    `Server started at http://${host}:${port}/api/${api_version}/`
  );
});

export default app;