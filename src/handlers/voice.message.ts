import {IBotConfig, IMessageHandler, MessageType} from "../types";
import {Context} from "telegraf";
import Uploader from "../helpers/Uploader";
import Converter from "../helpers/Converter";
import OpenAIService from "../services/OpenAI.service";
import {ChatCompletionRequestMessage} from "openai/api";

export default class VoiceMessage implements IMessageHandler {
    public key: MessageType = 'voice';
    private openAiService: OpenAIService;
    private converter: Converter;

    constructor() {
        this.openAiService = new OpenAIService();
        this.converter = new Converter();
    }

    // @ts-ignore
    async handle(ctx: Context<Update>, config: IBotConfig): void {
        const uploader: Uploader = new Uploader(config.paths.upload);

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

            const messages: ChatCompletionRequestMessage[] = [{role: 'user', content}];

            const response: any = await this.openAiService.chatCompletion(messages);

            await ctx.reply(response?.content);
        } catch (err: any) {
            console.log('Voice message handler error: ', err.message);
        }
    }
}