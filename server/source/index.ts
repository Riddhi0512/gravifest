import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
/* ROUTE IMPORTS */
import dashboardRoutes from "./routes/dashboardRoutes";
import eventRoutes from "./routes/eventRoutes";
import userRoutes from "./routes/userRoutes";
import registrationRoutes from "./routes/registrationRoutes";
import financeRoutes from "./routes/financeRoutes";

/* CONFIGURATIONS */
dotenv.config();
const app: Express = express();

(BigInt.prototype as any).toJSON = function() {
  return this.toString();
};

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/dashboard", dashboardRoutes);
app.use("/events", eventRoutes);
app.use("/user", userRoutes);
app.use("/registration", registrationRoutes);
app.use("/finance", financeRoutes);
/* SERVER */
const port = Number(process.env.PORT) || 3001;



app.listen(port, "0.0.0.0", () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});