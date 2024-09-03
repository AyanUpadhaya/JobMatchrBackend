const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./logger/logger");
const mainRouter = require("./routes/mainRouter");
const { initializeServer } = require("./config/server.config");
const { initializeMulter } = require("./config/multer.config");
const errorHandler = require("./middlewares/errorMiddleware");
const { 
  PORT, 
  MONGO_URI_DEV, 
  MONGO_URI_PROD 
} = require("./utils/constants");



const morganFormat = ":method :url :status :response-time ms";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
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
//multer
initializeMulter(app);
app.use(mainRouter);
app.use(errorHandler);
initializeServer(app, PORT, MONGO_URI_DEV);
