import express from "express";
import fs from "fs";
import { google } from "googleapis";
import { oauth2Client } from "../Google.js";

const router = express.Router();

// Cargar tokens del archivo (o DB)
function loadTokens() {
    const tokenPath = "token.json";
    if (!fs.existsSync(tokenPath)) throw new Error("No hay token. Autenticá primero.");
    const tokens = JSON.parse(fs.readFileSync(tokenPath));
    oauth2Client.setCredentials(tokens);
}

// Crear evento
router.post("/calendar/create", async (req, res) => {
    try {
        loadTokens();

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        const { summary, description, start, end } = req.body;

        const event = {
            summary,
            description,
            start: { dateTime: start, timeZone: "Europe/Madrid" },
            end: { dateTime: end, timeZone: "Europe/Madrid" },
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
        });
        const eventId = response.data.id;

        res.json({ success: true, id: eventId, eventLink: response.data.htmlLink });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

//Eliminar evento
router.post("/calendar/delete", async (req, res) => {
    try {
        const { eventId } = req.body;
        if (!eventId) {
            return res.status(400).json({ success: false, message: "Falta eventId" });
        }

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        await calendar.events.delete({
            calendarId: "primary",
            eventId: eventId,
        });

        res.json({ success: true, message: "Evento eliminado correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});





router.get("/calendar/list", async (req, res) => {
    try {
        // ⚡ Cargar tokens previamente guardados
        loadTokens(); // tu función que setea oauth2Client.setCredentials(tokens)

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Llamada a Google Calendar
        const eventsResponse = await calendar.events.list({
            calendarId: "primary",

        });


        console.log(eventsResponse.data);



        const events = eventsResponse.data.items;

        if (!events || events.length === 0) {
            return res.json({
                success: true,
                message: "No hay eventos próximos",
                events: [],
            });
        }

        // Retornar lista de eventos
        return res.json({
            success: true,
            message: "Eventos obtenidos correctamente",
            events: events.map(ev => ({
                id: ev.id,
                summary: ev.summary,
                description: ev.description || "",
                start: ev.start,
                end: ev.end,
                link: ev.htmlLink,
            })),
        });

    } catch (err) {
        console.error("Error al listar eventos:", err);
        return res.status(500).json({
            success: false,
            message: "Ha ocurrido un error al obtener los eventos",
            error: err.message,
        });
    }
});



export default router;
