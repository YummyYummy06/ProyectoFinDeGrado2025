import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = process.env;

console.log("🔍 GOOGLE_REDIRECT_URI:", `"${GOOGLE_REDIRECT_URI}"`);

export const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
);

export const SCOPES = ["https://www.googleapis.com/auth/calendar"];
