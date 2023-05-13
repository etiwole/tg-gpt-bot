import {Telegraf, session} from "telegraf";
import {IBotConfig, ICommandHandler, IMessageHandler} from "./types";
import {message} from "telegraf/filters";

export default class Bot {
    private bot: Telegraf<any>;
    private messageHandlers: IMessageHandler[];
    private commands: ICommandHandler[];
    private config: IBotConfig;

    constructor(config: IBotConfig) {
        this.bot = new Telegraf<any>(config.tokens.telegram);
        this.config = config;
        this.messageHandlers = config.handlers;
        this.commands = config.commands;
    }

    init(): void {
        this.commands.forEach(command => {
            this.bot.command(command.key, ctx => command.handle(ctx, this.config));
        });

        this.messageHandlers.forEach(handler => {
            this.bot.on(message(handler.key), ctx => handler.handle(ctx, this.config));
        });

        this.bot.use(session());
        this.bot.launch();
    }
};