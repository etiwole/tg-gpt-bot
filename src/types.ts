import {Context} from "telegraf";

export type MessageType = 'text' | 'voice';
export type CommandType = 'new' | 'start';

interface IAppTokens {
    telegram: string;
    openai: string;
}

export interface IBotConfig {
    tokens: IAppTokens;
    handlers: IMessageHandler[];
    commands: ICommandHandler[];
    paths: {
        upload: string,
    };
}

export interface IMessageHandler {
    key: MessageType;
    handle: (ctx: any, options: IBotConfig) => void;
}

export interface ICommandHandler {
    key: CommandType;
    handle: (ctx: any, options: IBotConfig) => void;
}