const bourseSchedules = {
    nyse: { hours: 9, minutes: 30, timezone: "America/New_York" },
    euronext: { hours: 9, minutes: 0, timezone: "Europe/Paris" },
    tokyo: { hours: 9, minutes: 0, timezone: "Asia/Tokyo" }
};

function calculateTimeToOpen(schedule) {
    const now = new Date();
    // Convertir l'heure actuelle dans le fuseau horaire de la bourse
    const nowInTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: schedule.timezone })
    );

    // Créer une date cible pour l'ouverture
    const target = new Date(nowInTimezone);
    target.setHours(schedule.hours, schedule.minutes, 0, 0);

    // Si l'heure actuelle dépasse l'heure cible, passer au lendemain
    if (nowInTimezone > target) {
        target.setDate(target.getDate() + 1);
    }

    // Retourner la différence en millisecondes
    return target - nowInTimezone;
}

function calculateTimeToClose(schedule) {
    const now = new Date();
    // Convertir l'heure actuelle dans le fuseau horaire de la bourse
    const nowInTimezone = new Date(
        now.toLocaleString("en-US", { timeZone: schedule.timezone })
    );

    // Créer une date cible pour la fermeture (17h)
    const closeTime = new Date(nowInTimezone);
    closeTime.setHours(17, 0, 0, 0); // Heure de fermeture à 17h

    // Si l'heure actuelle est après l'heure de fermeture, passer au lendemain
    if (nowInTimezone > closeTime) {
        closeTime.setDate(closeTime.getDate() + 1);
    }

    // Retourner la différence en millisecondes
    return closeTime - nowInTimezone;
}

function updateCountdown() {
    Object.keys(bourseSchedules).forEach(bourse => {
        const schedule = bourseSchedules[bourse];
        const timeToOpen = calculateTimeToOpen(schedule);
        const timeToClose = calculateTimeToClose(schedule);

        const now = new Date();
        // Convertir l'heure actuelle dans le fuseau horaire de la bourse
        const nowInTimezone = new Date(
            now.toLocaleString("en-US", { timeZone: schedule.timezone })
        );

        let hours, minutes, seconds, statusMessage, timeToEvent, color;

        // Vérifier si le marché est ouvert ou fermé
        if (nowInTimezone.getHours() >= schedule.hours && nowInTimezone.getMinutes() >= schedule.minutes &&
            nowInTimezone.getHours() < 17) {
            // Marché ouvert
            hours = Math.floor((timeToClose / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((timeToClose / (1000 * 60)) % 60);
            seconds = Math.floor((timeToClose / 1000) % 60);
            statusMessage = "Le marché est ouvert.";
            timeToEvent = "Ferme dans : ";
            color = "green";
        } else {
            // Marché fermé
            hours = Math.floor((timeToOpen / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((timeToOpen / (1000 * 60)) % 60);
            seconds = Math.floor((timeToOpen / 1000) % 60);
            statusMessage = "Le marché est fermé.";
            timeToEvent = "Ouvre dans : ";
            color = "red";
        }

         // Mettre à jour l'affichage
        document.querySelector(`#${bourse} .countdown`).textContent =
        `${timeToEvent} ${hours}h ${minutes}m ${seconds}s`;
        document.querySelector(`#${bourse} .status`).textContent =
        `${statusMessage}`;
        document.querySelector(`#${bourse} .status`).style.color = color;
        document.querySelector(`#${bourse}`).style.borderColor = color;

    });
}

setInterval(updateCountdown, 1000); // Mettre à jour chaque seconde.
