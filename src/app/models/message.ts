export type Message = {
    id?: string;
    chatID: number;
    userID: string;
    text: string;
    data?: Date;
    time?: string;
    edited: boolean;
    deleted: boolean;
};