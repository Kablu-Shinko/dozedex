import { Component, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
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

  user: User = this.userService.GetActualUser();
  toggled: boolean = this.dozedexService.GetSideNavBar();
  isLoginPage: boolean = true;

  ngOnInit(): void{
    let validUser: boolean = this.userService.VerifyUser(this.user);
    let path: string = '';

    if(!validUser){
      path = '/login';
    }
    else if(!this.user.KeepLogin){
      path = '/login';
    }
    else if(this.dozedexService.getLastPath().length > 0){
      path = this.dozedexService.getLastPath();
    }
    else{
      path = '/home'
    }

    this.isLoginPage = path === '/login';
    this.router.navigate([path]);
  }

  toogleSideNav(): boolean{
    return this.dozedexService.NavBarToggle();
  }
}
