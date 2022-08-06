export interface User {
    Email: string;
    Name?: string;
    UserName?: string;
    Password: string;
    OldPassword?: string;
    ImageUrl?: string;
    KeepLogin: Boolean;
    Token?: string;
    ImagePath?: string;
}