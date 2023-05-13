import OpenAIService from "../services/OpenAI.service";
import {IMessageHandler, MessageType} from "../types";
import {INITIAL_SESSION} from "../config/session";
import {OpenAiChatRoles} from "../services/OpenAI.service";

export default class TextMessage implements IMessageHandler {
    public key: MessageType = 'text';
    private openAiService: OpenAIService;

    constructor() {
        this.openAiService = new OpenAIService();
    }

    async handle(ctx: any): Promise<void> {
        ctx.session ??= INITIAL_SESSION;

        const {text: content} = ctx.message;

        ctx.session.messages.push({role: OpenAiChatRoles.USER, content});

        const response: any = await this.openAiService.chatCompletion(ctx.session.messages);

        ctx.session.messages.push({
            role: OpenAiChatRoles.ASSISTANT,
            content: response.content,
        });

        await ctx.reply(response?.content);
    }
}