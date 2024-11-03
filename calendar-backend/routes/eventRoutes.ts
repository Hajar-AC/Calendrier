import express, { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../ormconfig";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET_KEY = "0509";

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide" });
        req.user = user as { id: number };
        next();
    });
}

router.get("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    try {
        const events = await AppDataSource.manager.find(Event, { where: { user: { id: userId } } });

        const formattedEvents = events.map(event => ({
            ...event,
            startDate: new Date(event.startDate).toISOString().split("T")[0],
            endDate: new Date(event.endDate).toISOString().split("T")[0],
            startTime: event.startTime,
            endTime: event.endTime
        }));

        res.json(formattedEvents);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des événements", error });
    }
});


router.delete("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {



    try {
        await AppDataSource.manager.delete(Event, {});
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'événement", error });
    }
});


router.post("/", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const { title, startDate, endDate, startTime, endTime } = req.body;
    const userId = req.user?.id;

    if (!title || !startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ message: "Tous les champs (title, startDate, endDate, startTime, endTime) sont requis" });
    }

    try {
        const user = await AppDataSource.manager.findOne(User, { where: { id: userId } });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const event = new Event();
        event.title = title;
        event.startDate = startDate;
        event.endDate = endDate;
        event.startTime = startTime;
        event.endTime = endTime;
        event.user = user;

        await AppDataSource.manager.save(event);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'événement", error });
    }
});

router.put("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = parseInt(req.params.id);
    const { title, startDate, endDate, startTime, endTime }: Event = req.body;
    const userId = req.user?.id;

    if (!title || !startDate || !endDate || !startTime || !endTime) {
        return res.status(400).json({ message: "Tous les champs (title, date, time) sont requis pour la mise à jour" });
    }

    try {
        const event = await AppDataSource.manager.findOne(Event, { where: { id: eventId, user: { id: userId } } });
        if (!event) return res.status(404).json({ message: "Événement non trouvé ou non autorisé" });

        event.title = title;
        event.startDate = startDate;
        event.endDate = endDate;
        event.startTime = startTime;
        event.endTime = endTime;
        await AppDataSource.manager.save(event);
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'événement", error });
    }
});


router.delete("/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;

    try {
        // const event = await AppDataSource.manager.findOne(Event, { where: { id: eventId, user: { id: userId } } });
        const event = await AppDataSource.manager.findOne(Event, { where: { id: eventId, } });

        if (!event) return res.status(404).json({ message: "Événement non trouvé ou non autorisé" });

        await AppDataSource.manager.remove(event);
        res.json({ message: "Événement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'événement", error });
    }
});


router.get("/events/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    const userId = parseInt(req.params.id);
    try {
        const events: Event[] = await AppDataSource.manager.find(Event, { where: { user: { id: userId } } });
        if (!events) return res.status(404).json({ message: "Événement non trouvé ou non autorisé" });

        await AppDataSource.manager.remove(events);
        res.json({ message: "Événement supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'événement", error });
    }
});

export default router;


