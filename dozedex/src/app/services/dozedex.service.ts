import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})

export class DozedexService{

    private DozedexApiURL = environment.API_URL;

    constructor(private http: HttpClient) {}

    async VerifyUser(user: User): Promise<Auth>{
        var response: any = await firstValueFrom(this.http.post(`${this.DozedexApiURL}/auth/`, user));
        var result: Auth = {
            auth: response['auth'],
            token: response['token']
        };

        return result;
    }
}