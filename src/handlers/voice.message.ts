import {IBotConfig, IMessageHandler, MessageType} from "../types";
import {Context} from "telegraf";
import Uploader from "../helpers/Uploader";
import Converter from "../helpers/Converter";
import OpenAIService, {OpenAiChatRoles} from "../services/OpenAI.service";
import {ChatCompletionRequestMessage} from "openai/api";
import {INITIAL_SESSION} from "../config/session";
import {code} from "telegraf/format";

export default class VoiceMessage implements IMessageHandler {
    public key: MessageType = 'voice';
    private openAiService: OpenAIService;
    private converter: Converter;

    constructor() {
        this.openAiService = new OpenAIService();
        this.converter = new Converter();
    }

    async handle(ctx: any, config: IBotConfig): Promise<void> {
        const uploader: Uploader = new Uploader(config.paths.upload);

        ctx.session ??= INITIAL_SESSION;

        const userId: string = String(ctx.message.from.id);
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);

        try {
            const oggVoicePath: string = await uploader.upload(link.href, userId, 'ogg') as string;
            const mp3VoicePath = await this.converter.convert(oggVoicePath, userId) as string;

            const content = await this.openAiService.createTranscription(mp3VoicePath);
            if ('string' !== typeof content) {
                await ctx.reply('Сообщение не распознано');
                return;
            }

            await ctx.reply(code(`Ваш запрос: ${content}`))

            ctx.session.messages.push({role: 'user', content});

            const response: any = await this.openAiService.chatCompletion(ctx.session.messages);

            ctx.session.messages.push({
                role: OpenAiChatRoles.ASSISTANT,
                content: response.content,
            });

            await ctx.reply(response?.content);
        } catch (err: any) {
            console.log('Voice message handler error: ', err.message);
        }
    }
}