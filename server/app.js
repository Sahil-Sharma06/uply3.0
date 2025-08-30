import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
const Port = process.env.PORT || 8000;

//cors middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//regular express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Healthcheck: uply");
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});