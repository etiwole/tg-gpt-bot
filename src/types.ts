import {Context} from "telegraf";

export type MessageType = 'text' | 'voice';

interface IAppTokens {
    telegram: string;
    openai: string;
}

export interface IBotConfig {
    tokens: IAppTokens;
    handlers: IMessageHandler[];
    paths: {
        upload: string,
    };
}

export interface IMessageHandler {
    key: MessageType;
    // @ts-ignore
    handle: (ctx: Context<Update>, options: IBotConfig) => void;
}