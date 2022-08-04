import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Injectable({
    providedIn: 'root'
})

export class UserService{
    private DozedexApiURL = environment.API_URL;
    constructor(private http: HttpClient) {}

    ConfigDefault(user: User): void {
        this.setUserToken(user.Token ?? '');
        this.setUserEmail(user.Email ?? '');
        this.setKeepLogin(user.KeepLogin);
    }

    Reset(){
        this.setKeepLogin(false);
        this.setUserEmail('');
        this.setUserToken('');
    }

    //#region get

    getUserToken(): string | null {
        return localStorage.getItem("dozedex_user_token");
    }

    getUserEmail(): string | null {
        return localStorage.getItem("dozedex_user_email");
    }

    getKeepLogin(): Boolean {
        var keepLogin: string = localStorage.getItem("dozedex_user_keepLogin") ?? '';
        return keepLogin.length > 0 ? keepLogin === 'true' : false;
    }

    getUserImageURL(): string {
        return localStorage.getItem("dozedex_user_userImageURL") ?? "https://cdn.glitch.com/0e4d1ff3-5897-47c5-9711-d026c01539b8%2Fbddfd6e4434f42662b009295c9bab86e.gif?v=1573157191712"
    }

    //#endregion get

    //#region set

    setUserToken(token: string): void {
        localStorage.setItem("dozedex_user_token", token);
    }

    setUserEmail(email: string) : void {
        localStorage.setItem("dozedex_user_email", email);
    }

    setKeepLogin(keepLogin: Boolean): void {
        localStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
    }

    //#endregion set
}