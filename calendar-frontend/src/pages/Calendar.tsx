/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../services/api";
import { Event } from '../../../calendar-backend/entities/Event';
import { Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




interface User {
    id: number,
    firstName: string,
    lastName: string,
    events: Event[],
}
const Calendar: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    // charge événements de l'uti
    useEffect(() => {
        // TODO: fetch users
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/auth/current-user");
            console.log("Requête envoyée avec token :", response.config.headers["Authorization"]);
            console.log("Requête envoyée avec token :", response.data);
            const userResponse = await api.get("/auth");

            setUsers(userResponse.data);
            setUser(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des événements :", error);
        }
    };

    const handleAddOrEditEvent = async () => {

        if (!currentEvent.title || currentEvent.title.trim() === "") {
            toast.error("Veuillez remplir le titre de l'événement !");
            return;
        }
        if (currentEvent.id) {
            await handleEditEvent(currentEvent as Event).catch((error: Error) => {
                console.log(`error: ${error}`);
            });
        } else {
            await handleAddEvent(currentEvent).catch((error: Error) => {
                console.log(`error: ${error}`);
            });
        }
        setIsDialogOpen(false);
        fetchUser();
    };

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUserId: string = event.target.value;
        const userId: number = parseInt(selectedUserId);
        const selectedUser: User | undefined = users.find((value) => value.id == userId);
        if (selectedUser == undefined) {
            throw `No user with id: ${userId}`;
        }

        setUser(selectedUser);
    };
    const handleAddEvent = async (event: Partial<Event>) => {
        try {
            if (event.title == null || event.title.trim() == ``) return

            const response = await api.post("/events", event);
            setUser(prev => ({ ...prev!, events: [...prev!.events, response.data] }));

        } catch (error) {
            console.error("Erreur lors de l'ajout de l'événement :", error);
        }
    };


    const handleEditEvent = async (event: Event) => {
        try {
            if (event.title.trim() == ``) return
            await api.put(`/events/${event.id}`, event);
            setUser(prev => ({ ...prev!, events: user!.events.map((e) => (e.id === event.id ? event : e)) }));

        } catch (error) {
            console.error("Erreur lors de la modification de l'événement :", error);
        }
    };

    const handleDeleteEvent = async (eventId: number) => {
        const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?");
        if (!isConfirmed) return;
        try {
            await api.delete(`/events/${eventId}`);
            setUser(prev => ({ ...prev!, events: user!.events.filter((e) => e.id !== eventId) }));

        } catch (error) {
            console.error("Erreur lors de la suppression de l'événement :", error);
        }
    };

    // déconnexion
    const handleLogout = () => {
        localStorage.removeItem("token"); // supprime token JWT
        localStorage.removeItem("username"); // supprime le nom de l'uti
        navigate("/");
    };

    const getWeekDates = () => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            date.setHours(0, 0, 0, 0);
            return date;
        });
    };

    return (
        <div className="p-6 h-screen">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="flex-col flex h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Calendrier Hebdomadaire</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4 mb-4">
                            <span>Bienvenue, {username} !</span>
                            {(user != null) ? <select className="border p-2 rounded" defaultValue={user == null ? -1 : user.id}
                                onChange={handleUserChange}>
                                {users.map((user) => (

                                    <option key={user.id} value={user.id} >{`${user.firstName} ${user.lastName}`}</option>
                                ))}
                            </select> : <></>}
                            <button onClick={handleLogout} className="text-red-500">Déconnexion</button>

                        </div>

                    </div>
                </div>
                <div>
                    {/* navigation semaine */}
                    <div className="flex justify-between mb-4">
                        { /*<button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))} className="text-blue-500">
                            Semaine Précédente
                        </button>*/}
                        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))} className="text-blue-500">
                            <ChevronLeft size={24} /></button>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => date && setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            className="border p-2 rounded"
                            showWeekNumbers
                            placeholderText="Sélectionnez une semaine"
                        />
                        {/*<button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))} className="text-blue-500">
                            Semaine Suivante
                        </button>*/}
                        <button onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))} className="text-blue-500">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* affichage événements */}
                    <div className="grid grid-cols-7 gap-4">
                        {getWeekDates().map((date) => (
                            < div key={date.toDateString()} className="border p-2 rounded" >
                                <div className="font-bold text-center">
                                    {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "numeric" })}
                                </div>
                                <div>
                                    {(user == null ? [] : user.events)
                                        .filter((event) => {
                                            const eventStartDate = new Date(event.startDate);
                                            const eventEndDate = new Date(event.endDate);
                                            console.log(`${event.title} start Date ${eventStartDate} ${date} ${date >= eventStartDate}`)
                                            date.setHours(23, 59, 59,)
                                            const isValidStart = date >= eventStartDate
                                            date.setHours(0, 0, 0, 0)
                                            const isValidEnd = date <= eventEndDate;
                                            return (
                                                (isValidStart && isValidEnd) ||
                                                (eventStartDate.toDateString() === eventEndDate.toDateString() &&
                                                    eventStartDate.toDateString() === date.toDateString())
                                            );
                                        })
                                        .map((event) => (
                                            <div key={event.id} className="mt-2 p-2 bg-blue-100 rounded">
                                                <strong>{event.startTime} - {event.endTime}</strong> - {event.title}
                                                <div className="flex justify-between mt-1">
                                                    <button onClick={() => { setCurrentEvent(event); setIsDialogOpen(true); }} className="text-green-500 text-sm"><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 text-sm"><Trash2 size={16} /></button>

                                                    {/* <button onClick={() => { setCurrentEvent(event); setIsDialogOpen(true); }} className="text-green-500 text-sm">Modifier</button>
                                                    <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 text-sm">Supprimer</button>*/}

                                                </div>
                                            </div>
                                        ))}
                                    <button
                                        onClick={() => {
                                            setCurrentEvent({
                                                startDate: date.toLocaleDateString("fr-CA"),
                                                endDate: date.toLocaleDateString("fr-CA"),
                                                startTime: "09:00",
                                                endTime: "10:00"
                                            });
                                            setIsDialogOpen(true);
                                        }}
                                        className="text-blue-500 text-sm mt-2 block"
                                    >
                                        + Ajouter un événement
                                    </button>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>


            {/* Dialog add ou modifier evenemt */}
            {
                isDialogOpen && (
                    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                            <h2 className="text-lg font-bold">{currentEvent.id ? "Modifier l'événement" : "Ajouter un événement"}</h2>
                            <div className="mt-4">
                                <label className="block text-sm">Titre :</label>
                                <input
                                    type="text"
                                    value={currentEvent.title || ""}
                                    onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm">Date de début :</label>
                                <DatePicker
                                    selected={currentEvent.startDate ? new Date(currentEvent.startDate) : null}
                                    onChange={(date: Date | null) => date && setCurrentEvent({ ...currentEvent, startDate: date.toISOString().split("T")[0] })}
                                    dateFormat="yyyy-MM-dd"
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm">Date de fin :</label>
                                <DatePicker
                                    selected={currentEvent.endDate ? new Date(currentEvent.endDate) : null}
                                    onChange={(date: Date | null) => date && setCurrentEvent({ ...currentEvent, endDate: date.toISOString().split("T")[0] })}
                                    dateFormat="yyyy-MM-dd"
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm">Heure de début :</label>
                                <DatePicker
                                    selected={currentEvent.startTime ? new Date(`1970-01-01T${currentEvent.startTime}`) : null}
                                    onChange={(date: Date | null) => date && setCurrentEvent({ ...currentEvent, startTime: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) })}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Heure de début"
                                    dateFormat="HH:mm"
                                    className="border p-2 rounded w-full"
                                />
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm">Heure de fin :</label>
                                <DatePicker
                                    selected={currentEvent.endTime ? new Date(`1970-01-01T${currentEvent.endTime}`) : null}
                                    onChange={(date: Date | null) => date && setCurrentEvent({ ...currentEvent, endTime: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) })}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Heure de fin"
                                    dateFormat="HH:mm"
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button onClick={() => setIsDialogOpen(false)} className="text-red-500 mr-4">Annuler</button>
                                <button onClick={handleAddOrEditEvent} className="text-blue-500">Enregistrer</button>


                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Calendar;
