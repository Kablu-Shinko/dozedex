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
    
    //TODO: adicionar verificação de token
    private async GetUserByEmail(email: string): Promise<User>{
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
        
		this.SetUser(user, user.KeepLogin);
    }

	public GetUser(cached: boolean = false): User{
		let email: string;		
		let imagePath: string; 	
		let keepLogin: boolean; 	
		let imageUrl: string;	
		let name: string; 		
		let token: string; 		
		let userName: string; 	

		if(cached){
			email = 	localStorage.getItem("dozedex_user_email") ?? "";
			imagePath = localStorage.getItem("dozedex_user_userImagePath") ?? ""
			keepLogin = (localStorage.getItem("dozedex_user_keepLogin") ?? '') === 'true';
			imageUrl = 	(localStorage.getItem("dozedex_user_userImageUrl") ?? '').length > 0 ? localStorage.getItem("dozedex_user_userImageUrl") ?? '' : this.imageService.NotFoundImageURL;
			name = 		localStorage.getItem("dozedex_user_name") ?? "";
			token = 	localStorage.getItem("dozedex_user_token") ?? "";
			userName = 	localStorage.getItem("dozedex_user_username") ?? "";
		}
		else{
			email = 	sessionStorage.getItem("dozedex_user_email") ?? "";
			imagePath = sessionStorage.getItem("dozedex_user_userImagePath") ?? ""
			keepLogin = (sessionStorage.getItem("dozedex_user_keepLogin") ?? '') === 'true';
			imageUrl = 	(sessionStorage.getItem("dozedex_user_userImageUrl") ?? '').length > 0 ? sessionStorage.getItem("dozedex_user_userImageUrl") ?? '' : this.imageService.NotFoundImageURL;
			name = 		sessionStorage.getItem("dozedex_user_name") ?? "";
			token = 	sessionStorage.getItem("dozedex_user_token") ?? "";
			userName = 	sessionStorage.getItem("dozedex_user_username") ?? "";
		}

        return {
            Email: email,
            Password: '',
            ImagePath: imagePath,
            KeepLogin: keepLogin,
			ImageUrl: imageUrl,
			Name: name,
			OldPassword: '',
			Token: token,
			UserName: userName
        }
	}

	public SetUser(user: User, cached: boolean = false): void{
		if(cached){
			localStorage.setItem("dozedex_user_email", user.Email ?? "");
			localStorage.setItem("dozedex_user_userImagePath", user.ImagePath ?? "");
			localStorage.setItem("dozedex_user_keepLogin", user.KeepLogin ? 'true' : 'false');
			localStorage.setItem("dozedex_user_userImageUrl", user.ImageUrl ?? "");
			localStorage.setItem("dozedex_user_name", user.Name ?? "");
			localStorage.setItem("dozedex_user_token", user.Token ?? "");
			localStorage.setItem("dozedex_user_username", user.UserName ?? "");
		}

		sessionStorage.setItem("dozedex_user_email", user.Email ?? "");
		sessionStorage.setItem("dozedex_user_userImagePath", user.ImagePath ?? "");
		sessionStorage.setItem("dozedex_user_keepLogin", user.KeepLogin ? 'true' : 'false');
		sessionStorage.setItem("dozedex_user_userImageUrl", user.ImageUrl ?? "");
		sessionStorage.setItem("dozedex_user_name", user.Name ?? "");
		sessionStorage.setItem("dozedex_user_token", user.Token ?? "");
		sessionStorage.setItem("dozedex_user_username", user.UserName ?? "");
	}

	public ResetUser(cached: boolean): void{
		if(cached){
			localStorage.removeItem("dozedex_user_email");
			localStorage.removeItem("dozedex_user_userImagePath");
			localStorage.removeItem("dozedex_user_keepLogin");
			localStorage.removeItem("dozedex_user_userImageUrl");
			localStorage.removeItem("dozedex_user_name");
			localStorage.removeItem("dozedex_user_token");
			localStorage.removeItem("dozedex_user_username");
		}
		else{
			sessionStorage.removeItem("dozedex_user_email");
			sessionStorage.removeItem("dozedex_user_userImagePath");
			sessionStorage.removeItem("dozedex_user_keepLogin");
			sessionStorage.removeItem("dozedex_user_userImageUrl");
			sessionStorage.removeItem("dozedex_user_name");
			sessionStorage.removeItem("dozedex_user_token");
			sessionStorage.removeItem("dozedex_user_username");
		}
	}

	private setKeepLogin(keepLogin: boolean): void{
		localStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
		sessionStorage.setItem("dozedex_user_keepLogin", keepLogin ? 'true' : 'false');
	}

	public VerifyUser(user: User): boolean {
		if(user === undefined){
			return false;
		}

		if(user.Email === undefined || user.Email.length === 0){
			return false;
		}

		if(user.ImagePath === undefined || user.ImagePath.length === 0){
			return false;
		}

		if(user.ImageUrl === undefined || user.ImageUrl.length === 0){
			return false;
		}

		if(user.KeepLogin === undefined){
			return false;
		}

		if(user.Name === undefined || user.Name.length === 0){
			return false;
		}

		if(user.UserName === undefined || user.UserName.length === 0){
			return false;
		}

		if(user.Token === undefined || user.Token.length === 0){
			return false;
		}

		return true;
	}

    // desabilitado temporariamente
    // async RefreshData(): Promise<void>{
    //     var user: User = this.getUser();
    //     this.resetUser();
    //     await this.ConfigDefault(user);
    // }

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