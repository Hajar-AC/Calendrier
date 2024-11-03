import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";
import { Event } from "../entities/Event";


const router = express.Router();
const SECRET_KEY = "0509";  // clé secrete dans .env 

interface AuthenticatedRequest extends Request {
  user?: any;
}


function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    req.user = user;
    next();
  });
}


router.post("/register", async (req, res) => {
  const { firstName, lastName, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.password = hashedPassword;

  await AppDataSource.manager.save(user);
  res.json({ message: "Utilisateur inscrit avec succès" });
});

router.post("/login", async (req, res) => {
  const { firstName, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Mot de passe manquant" });
  }

  try {
    const user = await AppDataSource.manager.findOne(User, { where: { firstName } });
    if (!user || !user.password) {
      return res.status(400).json({ message: "Utilisateur ou mot de passe incorrect" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Utilisateur ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error });
  }
});



router.get("/", async (req, res) => {
  try {
    const users: any[] = await AppDataSource.manager.find(User);
    for (let user of users) {
      user.events = await AppDataSource.manager.find(Event, { where: { user: { id: user.id } } });
      user.password = null;
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
  }
});

router.get("/current-user", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const user = await AppDataSource.manager.findOne(User, { where: { id: userId } });
    const events: Event[] = await AppDataSource.manager.find(Event, { where: { user: { id: userId } } });
    res.json({ id: user!.id, firstName: user!.firstName, lastName: user!.lastName, events: events });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
  }
});

export default router;



