import {IMessageHandler, MessageType} from "../types";
import {Context} from "telegraf";
import OpenAIService from "../services/OpenAI.service";
import {ChatCompletionRequestMessage} from "openai/api";

export default class TextMessage implements IMessageHandler {
    public key: MessageType = 'text';
    private openAiService: OpenAIService;

    constructor() {
        this.openAiService = new OpenAIService();
    }

    // @ts-ignore
    async handle(ctx: Context<Update>): void {
        const {text: content} = ctx.message;

        const messages: ChatCompletionRequestMessage[] = [{role: 'user', content}];

        const response: any = await this.openAiService.chatCompletion(messages);

        await ctx.reply(response?.content);
    }
}