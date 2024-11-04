Description du Projet

Ce projet est une application de gestion d'événements dans un calendrier hebdomadaire. Il permet aux utilisateurs de :
- Voir leurs événements par semaine.
- Ajouter, modifier et supprimer des événements.
- Naviguer entre différentes semaines.
- Sélectionner des utilisateurs pour voir leurs événements.
- Se déconnecter de l’application.

Le composant principal de l'application est Calendar.tsx, qui gère l'affichage et la manipulation des événements. Il utilise une API backend pour stocker les événements et les utilisateurs.

Détails Techniques

Technologies Utilisées
- Frontend : React avec TypeScript, react-datepicker pour la sélection des dates et axios pour les requêtes API.
- Backend : Express.js avec TypeScript (et une API REST pour les opérations CRUD sur les événements et les utilisateurs).
- Notifications : toasti pour afficher des notifications (par exemple, en cas de champs obligatoires manquants).
- Authentification : JWT (JSON Web Token) pour sécuriser les accès.

Structure du Composant Calendar.tsx

Variables d'État
- events : Liste des événements de l’utilisateur sélectionné.
- selectedDate : Date actuellement sélectionnée, utilisée pour naviguer entre les semaines.
- isDialogOpen : Contrôle l’affichage du popup pour ajouter ou modifier un événement.
- currentEvent : Détails de l'événement en cours d'ajout ou de modification.
- username : Nom de l'utilisateur connecté (affiché dans la vue du calendrier).
- users : Liste des utilisateurs disponibles pour l’affichage des événements.
- selectedUserId : ID de l'utilisateur dont les événements sont affichés.


Fonctions API

1. fetchUsers : Charge la liste des utilisateurs chacune avec ses événements au démarrage et les affiche dans un menu déroulant.
2. handleAddEvent : Envoie une requête POST à l’API pour ajouter un nouvel événement et met à jour l'état events.
3. handleEditEvent : Envoie une requête PUT pour modifier un événement existant.
4. handleDeleteEvent : Demande une confirmation avant de supprimer un événement.
5. handleUserChange : Met à jour selectedUserId et recharge les événements pour l’utilisateur sélectionné.
6. handleLogout : Supprime le token JWT et redirige vers la page de connexion.


Fonctionnalités du Composant Calendar.tsx

1. Navigation de la Semaine : Boutons pour naviguer entre les semaines et un DatePicker pour sélectionner une semaine spécifique.
2. Affichage des Événements : Affiche les événements de la semaine sélectionnée et permet des modifications et suppressions.
3. Changement d'Utilisateur : Menu déroulant pour sélectionner un utilisateur et afficher ses événements.
4. Boîte de Dialogue : Permet l'ajout et la modification d'événements.
5. Déconnexion : Bouton pour se déconnecter de l'application.


Utilisation de l'Application

1. Connexion et Inscription : Connectez-vous ou inscrivez-vous.
2. Vue du Calendrier : Le calendrier affiche la semaine actuelle avec possibilité de navigation.
3. Notifications : Une notification toasti apparaît si le titre est manquant.
4. Déconnexion : Bouton pour se déconnecter de l'application.

Instructions d'Exécution du Projet

1. Cloner le Dépôt.
2. Installation des dépendances :
- Backend : cd calendar-backend
            npm install

- Frontend :  cd calendar-frontend
              npm install

- Configuration des variables d'environnement:

Dans le dossier calendar-backend créez un fichier .env et le repmlir par :   SECRET_KEY="0509"
                                                                             DATABASE_URL=sqlite://./dev.db
                                                                             PORT=3000


3. Démarrer le projet :  
- Dans le dossier calendar-backend : npm start

- Dans le dossier calendar-frontend : npm run dev

4. Accéder à l'application :
- pour accéder au frontend : http://localhost:5173

- Le backend est disponible sur le port 3000 : http://localhost:3000
