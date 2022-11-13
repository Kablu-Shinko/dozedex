import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { AppVersion } from '../interfaces/small-interfaces/small-interfaces';
import DozedexAppBinary from '../../../package.json';


@Injectable({
    providedIn: 'root'
})

export class DozedexService implements OnInit{

    private DozedexApiURL = environment.API_URL;
    private AuthApiURL = `${this.DozedexApiURL}/auth`
    private pathsNavigated: string[] = []; 

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.pathsNavigated.push(this.getLastPath());
    }

    async VerifyAppVersion(): Promise<AppVersion> {
        var appVersion: AppVersion = {
            ActualVersion: DozedexAppBinary.version,
            ServerVersion: '',
            IsUpdated: false
        }; 

        try{
            var serverVersion : any = await firstValueFrom(this.http.post(`${this.DozedexApiURL}/app/verify-version`, { Version : appVersion.ActualVersion }))
            appVersion.ServerVersion = serverVersion['ServerVersion']
            appVersion.IsUpdated = serverVersion['IsUpdated']
        }
        catch(error){
            console.log(error);
            appVersion.ServerVersion = '0.0.0';
            appVersion.IsUpdated = true;
        }
        finally{
            return appVersion;
        }
    }

    async verifyStatusAPI(): Promise<boolean> { 
        var ping: boolean = false;
        
        try{
            ping = await firstValueFrom(this.http.get(`${this.DozedexApiURL}/app/ping`)) == 'TA FUNCIONANDO, SAI';
        }
        catch(error){
            console.log(error);
            ping = false;
        }
        finally{
            return ping;
        }
    }

    GetLoadingImage(): string{
        return "https://gifmania.com.br/wp-content/uploads/2020/01/carregando.gif";
    }

    SetSideNavBar(open: boolean){
        localStorage.setItem("dozedex_sidenavbar_isopen", open ? 'true' : 'false');
    }

    GetSideNavBar(): boolean{
        return localStorage.getItem("dozedex_sidenavbar_isopen") === 'true';
    }

    NavBarToggle(): boolean{
        var isToggled: boolean = this.GetSideNavBar();
        this.SetSideNavBar(!isToggled);
        return this.GetSideNavBar();
    }

    VerifyLogin(): void{
        if(!(this.userService.VerifyUser(this.userService.GetActualUser()))){
            this.router.navigate(['/login']);
        }
    }

    async RefreshPage(path: string): Promise<void>{
        await this.userService.RefreshData();
        await this.router.navigateByUrl('/home', {skipLocationChange: true});
        await this.router.navigate([path]);
    }

    async VerifyUser(user: User): Promise<Auth>{
        var response: any = await firstValueFrom(this.http.post(`${this.AuthApiURL}`, user));
        var result: Auth = {
            auth: response['auth'],
            token: response['token']
        };

        if(result.auth){
            user.Token = result.token;
            await this.userService.ConfigDefault(user);
        }
        
        return result;
    }

    logOut(): void {
        this.userService.Reset();
        this.systemCacheReset();
        this.router.navigate(['/login']);
    }

    getBaseGoogleDriveURL(): string {
        return environment.GOOGLEDRIVE_URL;
    }

    notImplemented(): void{
        alert("não implementado ainda");
    };

    //#region system features

    addCurrentPath(path: string): void{
        this.pathsNavigated.push(path);
        var lastPath = this.pathsNavigated[this.pathsNavigated.length - 1]
        this.setLastPath(lastPath);
    }

    getLastPath(): string {
        return localStorage.getItem("dozedex_system_lastPath") ?? "";
    }

    setLastPath(path: string | null | undefined): void {
        localStorage.setItem("dozedex_system_lastPath", path ?? "");
    }

    systemCacheReset(){
        this.setLastPath("");
    }

    //#endregion system features
}
