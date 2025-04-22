export type User = {
    id?: string;
    tag: string;
    name: string;
    description: string;
    status: number;
    profilePicture: string;

    email: string;
    password: string;

    chats: Array<number>;
};