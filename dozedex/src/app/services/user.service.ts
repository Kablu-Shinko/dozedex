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
    private DefaultProfileFormError: string = "Verifique os campos e tente novamente";

    constructor(
        private http: HttpClient,
        private imageService: ImageService    
    ) {}

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

    ConfigDefault(user: User): void {
        if(user.Email.length > 0){
            let token = user.Token;
            let keepLogin = user.KeepLogin;
            this.GetUserByEmail(user.Email).then((_user) => {
                user = _user
                user.Token = token;  
                user.KeepLogin = keepLogin;          
                
                this.setEmail(user.Email ?? '');
                this.setImageUrl(user.ImageUrl ?? '');
                this.setKeepLogin(user.KeepLogin);
                this.setName(user.Name ?? '');
                this.setToken(user.Token ?? '');
                this.setUserName(user.UserName ?? '');
            }); 
        }
    }

    GetActualUser(): User{
        let user: User = {
            Email: this.getEmail(),
            KeepLogin: this.getKeepLogin(),
            Password: "",
            ImageUrl: this.getImageURL(),
            ImagePath: this.imageService.GetFullImageURL(this.getImageURL()),
            Name: this.getName(),
            Token: "",
            UserName: this.getUserName()
        };
        return user;
    }

    Reset(){
        this.setToken('');
        this.setEmail('');
        this.setImageUrl('');
        this.setName('');
        this.setUserName('');
        this.setKeepLogin(false);
    }

    //#region get

    getToken(): string {
        return localStorage.getItem("dozedex_user_token") ?? "";
    }

    getEmail(): string {
        return localStorage.getItem("dozedex_user_email") ?? "";
    }

    getKeepLogin(): Boolean {
        var keepLogin: string = localStorage.getItem("dozedex_user_keepLogin") ?? '';
        return keepLogin.length > 0 ? keepLogin === 'true' : false;
    }

    getImageURL(): string {
        var url = localStorage.getItem("dozedex_user_userImageUrl") ?? '';
        
        if(url?.length === 0){
            return "https://cdn.glitch.com/0e4d1ff3-5897-47c5-9711-d026c01539b8%2Fbddfd6e4434f42662b009295c9bab86e.gif?v=1573157191712";
        }
        
        return url;
    }

    getName(): string {
        return localStorage.getItem("dozedex_user_name") ?? "";
    }

    getUserName(): string {
        return localStorage.getItem("dozedex_user_username") ?? "";
    }

    //#endregion get

    //#region set

    setToken(token: string): void {
        localStorage.setItem("dozedex_user_token", token);
    }

    setEmail(email: string) : void {
        localStorage.setItem("dozedex_user_email", email);
    }

    setKeepLogin(keepLogin: Boolean): void {
        localStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
    }

    setImageUrl(imageUrl: string): void {
        localStorage.setItem("dozedex_user_userImageUrl", imageUrl);
    }

    setUserName(username: string): void{
        localStorage.setItem("dozedex_user_username", username);
    }

    setName(name: string): void{
        localStorage.setItem("dozedex_user_name", name);
    }

    //#endregion set

    async UpdateUser(user: User): Promise<void>{

        if(user === undefined || user.OldPassword === undefined || user.OldPassword.length === 0){
            alert(this.DefaultProfileFormError);   
            return;
        }

        var OldPassword: string = user.OldPassword;

        var passwordValid: Boolean = await this.VerifyPassword(user.Email, OldPassword);

        if(!passwordValid){
            alert("Senha atual incorreta");
            return;
        }

        try{
            var response: any = await firstValueFrom(this.http.post(`${this.API_UserRoute}/update`, {
                Email: user.Email,
                UserName: user.UserName,
                oldPassword: OldPassword,
                Password: user.Password,
                ImageUrl: user.ImageUrl,
                Name: user.Name
            }));
        }
        catch(ex: any){
            alert(ex['error']['Status']);
        }
    }

    async VerifyPassword(email: string, password: string): Promise<Boolean>{
        var response: any = await firstValueFrom(this.http.post(`${this.API_UserRoute}/verifyPassword`, {Email: email, Password: password}));
        var validator: Boolean = response['isValid'] === true || response['isValid'] === "true";
        return validator;
    }
}