import {Telegraf, session} from "telegraf";
import {IBotConfig, IMessageHandler} from "./types";
import {message} from "telegraf/filters";

export default class Bot {
    private bot: Telegraf<any>;
    private messageHandlers: IMessageHandler[];
    private config: IBotConfig;

    constructor(config: IBotConfig) {
        this.bot = new Telegraf<any>(config.tokens.telegram);
        this.messageHandlers = config.handlers;
        this.config = config;
    }

    init(): void {
        this.messageHandlers.forEach(handler => {
            this.bot.on(message(handler.key), ctx => handler.handle(ctx, this.config));
        });

        this.bot.use(session());
        this.bot.launch();
    }
};