import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './interfaces/user.interface';
import { DozedexService } from './services/dozedex.service';

import { UserService } from './services/user.service';

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
    private dozedexService: DozedexService
  )
  {}

  user: User = this.userService.GetUser();
  toggled: boolean = this.dozedexService.GetSideNavBar();
  isLoginPage: boolean = true;
  statusAPI: boolean = false;

  async ngOnInit(): Promise<void>{
    let validUser: boolean = this.userService.VerifyUser(this.user);
    let path: string = '';

    while(!this.statusAPI){
      this.statusAPI = await this.dozedexService.verifyStatusAPI();
    }

    if(validUser && this.user.KeepLogin){
      if(this.dozedexService.getLastPath().length > 0){
        path = this.dozedexService.getLastPath() === '/login' ? '/home' : this.dozedexService.getLastPath();
      }
      else{
        path = '/home';
      }
    }
    else{
      path = '/login'
    }

    this.router.navigate([path]);
  }

  toogleSideNav(): boolean{
    return this.dozedexService.NavBarToggle();
  }
}