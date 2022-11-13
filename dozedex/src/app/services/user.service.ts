import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImageService } from './image.service';

@Injectable({
    providedIn: 'root'
})

export class UserService{
    private DozedexApiURL = environment.API_URL;
    private API_UserRoute = `${this.DozedexApiURL}/user`;

    constructor(
        private http: HttpClient,
        private imageService: ImageService    
    ) {}
    
    //ok
    async GetUserByEmail(email: string): Promise<User>{
        var objeto: {Email: string} = {Email: email};
        var response: any = await firstValueFrom(this.http.post(`${this.API_UserRoute}/getUserByEmail`, objeto));
        var result: User = {
            Email: response['Email'],
            KeepLogin: false,
            Password: '',
            ImagePath: '',
            ImageUrl: response['ImageUrl'],
            Name: response['Name'],
            Token: '',
            UserName: response['UserName']
        }

        return result;
    }

    //ok
    async ConfigDefault(user: User): Promise<void> {
        let token = user.Token;
        let keepLogin = user.KeepLogin;
        let _user = await this.GetUserByEmail(user.Email);

        user = _user;
        user.Token = token;  
        user.KeepLogin = keepLogin;  
        user.ImagePath = this.imageService.GetFullImageURL(user.ImageUrl ?? "");
        
        this.setEmail(user.Email);
        this.setImageUrl(user.ImageUrl);
        this.setKeepLogin(user.KeepLogin);
        this.setName(user.Name);
        this.setToken(user.Token);
        this.setUserName(user.UserName);
        this.setImagePath(user.ImagePath);
    }

    GetUser(): User{
        var user: User;
        var keepLogin: boolean = this.getKeepLogin();

        if(keepLogin){
            user = this.GetUserCache();
        }
        else{
            user = {
                Email: '',
                KeepLogin: false,
                Password: '',
                ImagePath: '',
                ImageUrl: '',
                Name: '',
                OldPassword: '',
                Token: '',
                UserName: ''
            }
        }

        return user;
    }

    //ok
    GetActualUser(): User{
        var user: User = {
            Email: this.getEmail(),
            KeepLogin: this.getKeepLogin(),
            Password: "",
            ImageUrl: this.getImageURL(),
            ImagePath: this.getImagePath(),
            Name: this.getName(),
            Token: this.getToken(),
            UserName: this.getUserName()
        };

        return user;
    }

    VerifyUser(user: User): boolean{
        if(!(user.Email.length > 0 && user.Token !== undefined && user.Token.length > 0)){
            return false;
        }

        return true;
    }

    //ok
    Reset(){
        this.setImagePath('');
        this.setEmail('');
        this.setToken('');
        this.setImageUrl('');
        this.setKeepLogin(false);
        this.setName('');
        this.setUserName('');
    }

    //ok
    async RefreshData(): Promise<void>{
        var user: User = this.GetActualUser();
        this.Reset();
        await this.ConfigDefault(user);
    }

    //ok
    //#region get

    private GetUserCache() : User {
        var user: User = {
            Email: localStorage.getItem("dozedex_user_email") ?? "",
            KeepLogin: this.getKeepLogin(),
            Password: '',
            ImageUrl: localStorage.getItem("dozedex_user_userImageUrl") ?? "",
            Name: localStorage.getItem("dozedex_user_name") ?? "",
            UserName: localStorage.getItem("dozedex_user_username") ?? "",
            ImagePath: localStorage.getItem("dozedex_user_userImagePath") ?? "",
            Token: localStorage.getItem("dozedex_user_token") ?? ""
        }

        return user;
    }

    private getToken(): string {
        return sessionStorage.getItem("dozedex_user_token") ?? "";
    }

    private getEmail(): string {
        return sessionStorage.getItem("dozedex_user_email") ?? "";
    }

    private getKeepLogin(): boolean {
        var keepLogin: string = localStorage.getItem("dozedex_user_keepLogin") ?? '';
        return keepLogin.length > 0 ? keepLogin === 'true' : false;
    }

    private getImageURL(): string {
        var url = sessionStorage.getItem("dozedex_user_userImageUrl") ?? '';
        
        if(url?.length === 0){
            return "https://cdn.glitch.com/0e4d1ff3-5897-47c5-9711-d026c01539b8%2Fbddfd6e4434f42662b009295c9bab86e.gif?v=1573157191712";
        }
        
        return url;
    }

    private getName(): string {
        return localStorage.getItem("dozedex_user_name") ?? "";
    }

    private getUserName(): string {
        return localStorage.getItem("dozedex_user_username") ?? "";
    }

    private getImagePath(): string {
        return localStorage.getItem("dozedex_user_userImagePath") ?? "";
    }

    //#endregion get

    //ok
    //#region set
    private configUserCache(user: User): void {
        localStorage.setItem("dozedex_user_token", user.Token ?? "");
        localStorage.setItem("dozedex_user_email", user.Email ?? "");
        localStorage.setItem("dozedex_user_keepLogin", user.KeepLogin ? 'true' : 'false');
        localStorage.setItem("dozedex_user_userImageUrl", user.ImageUrl ?? "");
        localStorage.setItem("dozedex_user_username", user.UserName ?? "");
        localStorage.setItem("dozedex_user_name", user.Name ?? "");
        localStorage.setItem("dozedex_user_userImagePath", user.ImagePath ?? "");
    }

    private setToken(token: string | null | undefined): void {
        sessionStorage.setItem("dozedex_user_token", token ?? "");
    }

    private setEmail(email: string | null | undefined): void {
        sessionStorage.setItem("dozedex_user_email", email ?? "");
    }

    private setKeepLogin(keepLogin: boolean | null | undefined): void {
        localStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
    }

    private setImageUrl(imageUrl: string | null | undefined): void {
        sessionStorage.setItem("dozedex_user_userImageUrl", imageUrl ?? "");
    }

    private setUserName(username: string | null | undefined): void{
        sessionStorage.setItem("dozedex_user_username", username ?? "");
    }

    private setName(name: string | null | undefined): void{
        sessionStorage.setItem("dozedex_user_name", name ?? "");
    }

    private setImagePath(path: string | null | undefined): void{
        sessionStorage.setItem("dozedex_user_userImagePath", path ?? "");
    }

    //#endregion set

    async UpdateUser(user: User): Promise<string>{
        try{
            if(user === undefined || user.OldPassword === undefined || user.OldPassword.length === 0){
                return "Verifique os campos e tente novamente";
            }

            var OldPassword: string = user.OldPassword;

            var passwordValid: boolean = await this.VerifyPassword(user.Email, OldPassword);

            if(!passwordValid){
                return "Senha atual incorreta";
            }

            this.setKeepLogin(user.KeepLogin);

            await firstValueFrom(this.http.post(`${this.API_UserRoute}/update`, {
                Email: user.Email,
                UserName: user.UserName,
                oldPassword: OldPassword,
                Password: user.Password,
                ImageUrl: user.ImageUrl,
                Name: user.Name
            }));
            return "Dados Atualizados!";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao atualizar os dados";
        }
    }

    async VerifyPassword(email: string, password: string): Promise<boolean>{
        var response: any = await firstValueFrom(this.http.post(`${this.API_UserRoute}/verifyPassword`, {Email: email, Password: password}));
        var validator: boolean = response['isValid'] === true || response['isValid'] === "true";
        return validator;
    }
}