import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/dbConnect.js";
connectDB();
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
 
const PORT = process.env.PORT || 3000



//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        credentials: true
    }
));
app.use(morgan("dev"));
app.use(cookieParser());


//Routes
app.use("/api/v1/auth", authRoute);








//API


app.get("/", (req, res) => {
    res.send("Hello, world!");
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});