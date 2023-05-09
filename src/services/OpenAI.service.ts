import {Configuration, OpenAIApi} from "openai";
import {ChatCompletionRequestMessage} from "openai/api";
import {createReadStream} from "fs";

export default class OpenAIService {
    private openai: OpenAIApi;
    constructor() {
        const config: Configuration = new Configuration({ apiKey: process.env.OPENAI_TOKEN });
        this.openai = new OpenAIApi(config);
    }

    async chatCompletion(messages: ChatCompletionRequestMessage[]) {
        try {
            const request = { model: 'gpt-3.5-turbo', messages };
            const response = await this.openai.createChatCompletion(request);

            return response.data.choices[0].message;
        } catch (err: any) {
            console.log('Error on openai chat request', err.message);
        }
    }

    async createTranscription(path: string) {
        try {
            const {data} = await this.openai.createTranscription(
                // @ts-ignore
                createReadStream(path),
                'whisper-1'
            );

            return data.text;
        } catch (err: any) {
            console.log('Error on openai transcription request', err.message);
        }
    }
}