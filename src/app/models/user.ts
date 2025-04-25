export type User = {
    id: string;
    name: string;
    description: string;
    status: number;
    profilePicture: string;

    email: string;
    password: string;

    chats: Array<string>;
};