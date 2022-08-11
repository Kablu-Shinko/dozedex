import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
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

    VerifyUser(user: User): Boolean{
        if(!(
            user.Email.length > 0
            && user.Token !== undefined
            && user.Token.length > 0
        )){
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

    private getToken(): string {
        return localStorage.getItem("dozedex_user_token") ?? "";
    }

    private getEmail(): string {
        return localStorage.getItem("dozedex_user_email") ?? "";
    }

    private getKeepLogin(): Boolean {
        var keepLogin: string = localStorage.getItem("dozedex_user_keepLogin") ?? '';
        return keepLogin.length > 0 ? keepLogin === 'true' : false;
    }

    private getImageURL(): string {
        var url = localStorage.getItem("dozedex_user_userImageUrl") ?? '';
        
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

    private setToken(token: string | null | undefined): void {
        localStorage.setItem("dozedex_user_token", token ?? "");
    }

    private setEmail(email: string | null | undefined) : void {
        localStorage.setItem("dozedex_user_email", email ?? "");
    }

    private setKeepLogin(keepLogin: Boolean | null | undefined): void {
        localStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
    }

    private setImageUrl(imageUrl: string | null | undefined): void {
        localStorage.setItem("dozedex_user_userImageUrl", imageUrl ?? "");
    }

    private setUserName(username: string | null | undefined): void{
        localStorage.setItem("dozedex_user_username", username ?? "");
    }

    private setName(name: string | null | undefined): void{
        localStorage.setItem("dozedex_user_name", name ?? "");
    }

    private setImagePath(path: string | null | undefined): void{
        localStorage.setItem("dozedex_user_userImagePath", path ?? "");
    }

    //#endregion set

    async UpdateUser(user: User): Promise<string>{

        if(user === undefined || user.OldPassword === undefined || user.OldPassword.length === 0){
            return "Verifique os campos e tente novamente";
        }

        var OldPassword: string = user.OldPassword;

        var passwordValid: Boolean = await this.VerifyPassword(user.Email, OldPassword);

        if(!passwordValid){
            return "Senha atual incorreta";
        }

        try{
            await firstValueFrom(this.http.post(`${this.API_UserRoute}/update`, {
                Email: user.Email,
                UserName: user.UserName,
                oldPassword: OldPassword,
                Password: user.Password,
                ImageUrl: user.ImageUrl,
                Name: user.Name
            }));
        }
        catch(ex: any){
            return ex['error']['Status'];
        }

        return "Dados Atualizados!";
    }

    async VerifyPassword(email: string, password: string): Promise<Boolean>{
        var response: any = await firstValueFrom(this.http.post(`${this.API_UserRoute}/verifyPassword`, {Email: email, Password: password}));
        var validator: Boolean = response['isValid'] === true || response['isValid'] === "true";
        return validator;
    }
}