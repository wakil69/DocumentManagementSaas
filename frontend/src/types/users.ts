export type User = {
    user_id: number;
    first_name: string;
    surname: string;
    civilite?: string;
    email: string;
    role: "admin" | "user"
    syndicats: {
        id: number;
        name: string
    }[]
}

export type GetUsers = User[]