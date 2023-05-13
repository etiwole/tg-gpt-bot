import {ChatCompletionRequestMessage} from "openai/api";

export const INITIAL_SESSION = {
    messages: [] as ChatCompletionRequestMessage[],
};