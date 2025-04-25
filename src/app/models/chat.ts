import { Message } from "./message";

export type Chat = {
    id: string;
    usersIDs: Array<string>;
    messages: Array<Message>;
};