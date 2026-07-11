import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import router from "./routes";

const app: Express = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve 3D model assets (skeleton.glb etc) — accessible at /api/assets/<file>
app.use("/api/assets", express.static(path.resolve("./public")));

app.use("/api", router);

export default app;
