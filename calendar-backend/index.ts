import express from "express";
import { AppDataSource } from "./ormconfig";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventRoutes";
import "reflect-metadata";
import cors from "cors";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Base de données connectée");

    app.listen(3000, () => {
      console.log("Serveur en écoute sur le port 3000");
    });
  })
  .catch((error) => console.log(error));


app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
