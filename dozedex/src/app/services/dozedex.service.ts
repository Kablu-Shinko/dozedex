import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class DozedexService{

    private DozedexApiURL = environment.API_URL;
    private AuthApiURL = `${this.DozedexApiURL}/auth`

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: Router
    ) {}

    InitService(): Boolean{
        try{
            var token: string = this.userService.getUserToken() ?? '';
            if(token.length === 0){
                return false;
            }
            var auth: any;

            firstValueFrom(this.http.post(`${this.AuthApiURL}/byToken/`, token)).then((item: any) => {
                console.log(item)
            });
            
            return true;
        }
        catch{
            return false;
        }
    }

    //#region authentication
    async VerifyUser(user: User): Promise<Auth>{
        var response: any = await firstValueFrom(this.http.post(`${this.AuthApiURL}`, user));
        var result: Auth = {
            auth: response['auth'],
            token: response['token']
        };

        if(result.auth){
            user.Token = result.token;
            this.userService.ConfigDefault(user);
        }

        return result;
    }

    //#region User comands
    logOut(): void {
        this.userService.Reset();
        this.router.navigate(['/login']);
      }
}