import dotenv from "dotenv"
import path from "path";
import Bot from "./bot";
import VoiceMessage from "./handlers/voice.message";
import TextMessage from "./handlers/text.message";
import {IBotConfig} from "./types";

dotenv.config({
    path: path.resolve(__dirname, '..', '.env.local'),
    override: true
});

const config: IBotConfig = {
    paths: {
        upload: path.resolve(__dirname, '..', 'uploads'),
    },
    tokens: {
        telegram: process.env.TELEGRAM_TOKEN || '',
        openai: process.env.OPENAI_TOKEN || '',
    },
    handlers: [
        new VoiceMessage(),
        new TextMessage(),
    ],
};

const bot: Bot = new Bot(config);

bot.init();