export interface User {
    Email: string;
    Name?: string;
    UserName?: string;
    Password: string;
    OldPassword?: string;
    ImageUrl?: string;
    KeepLogin: boolean;
    Token?: string;
    ImagePath?: string;
}