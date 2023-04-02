import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { User } from './interfaces/user.interface';
import { DozedexService } from './services/dozedex.service';

import { UserService } from './services/user.service';
import { AudioService } from './services/audio.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	title = 'dozedex';

	constructor(
		private router: Router,
		private userService: UserService,
		private dozedexService: DozedexService,
		private audioService: AudioService
	){}

	user: User = this.userService.GetUser();
	isLoginPage: boolean = true;
	statusAPI: boolean = false;

	async ngOnInit(): Promise<void>{
		while(!this.statusAPI) this.statusAPI = await this.dozedexService.verifyStatusAPI();

		let path = this.getPath();

		this.router.navigate([path]);
	}

	toogleSideNav(): boolean{
		return this.dozedexService.NavBarToggle();
	}

	private getPath(): string{
        let user = this.userService.GetUser()
		let validUser: boolean = this.userService.VerifyUser(user);

		if(!validUser){
			user = this.userService.GetUser(true);
			validUser = this.userService.VerifyUser(user);

			if((!validUser) || (!user.KeepLogin)) return '/login';
		}
		//in this part, session user is valid or cached user is login keeped
		
		let lastPath: string = this.dozedexService.getLastPath();

		if(lastPath.length === 0) return '/login';

		this.userService.SetUser(user, false);
		this
		return lastPath;
	}
}