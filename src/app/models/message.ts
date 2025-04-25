export type Message = {
    id?: string;
    chatID: string;
    userID: string;
    text: string;
    data?: Date;
    time?: string;
    edited: boolean;
    deleted: boolean;
};