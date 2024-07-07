import express from'express'
import cors from "cors";
import env from "dotenv";
import allRoutes from "./routes/index.routes.js";
env.config();
import connect from "./config/db.js";
connect();

const port = process.env.PORT || 4000
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", allRoutes);

const allowedOrigins = [
	"http://localhost:3000",
	"https://codehelp.in",
	"https://www.codehelp.in",
	"*",
];

const corsOptions = {
	origin: allowedOrigins,
	methods: "GET,POST,PUT,DELETE",
	credentials: true,
};

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log("Server is up and running at ", port)
})