const express = require("express");
const mongoose = require("mongoose");
const winston = require("winston");
const expressWinston = require("express-winston");
const dotenv = require("dotenv");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging HTTP requests and responses
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "combined.log" }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    // Customize logging to include user-specific logs
    dynamicMeta: (req, res) => {
      return {
        userId: req.user ? req.user.id : "anonymous",
        requestBody: req.body,
        queryParameters: req.query,
        responseStatus: res.statusCode,
        responseBody: res.body,
      };
    },
  })
);

// Routes
app.use("/auth", authRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      winston.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    winston.error("Error connecting to MongoDB:", error);
  });

module.exports = app;
