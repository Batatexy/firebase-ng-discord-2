import { Message } from "./message";

export type Chat = {
    id: number;
    usersIDs: Array<string>;
    messagesIDs: Array<string>;
};