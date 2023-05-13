import {CommandType, IBotConfig, ICommandHandler, MessageType} from "../types";
import {INITIAL_SESSION} from "../config/session";

export default class SessionCommand implements ICommandHandler {
    public key: CommandType = 'new';

    constructor(key: CommandType) {
        this.key = key;
    }

    async handle(ctx: any, options: IBotConfig): Promise<void> {
        ctx.session = INITIAL_SESSION;
        await ctx.reply(`Жду вашего голосового или текстового сообщения`);
    }
}