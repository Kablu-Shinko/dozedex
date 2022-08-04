import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private userService: UserService
  )
  {}

  ngOnInit(): void{
    var loginKeeped: Boolean = this.userService.getKeepLogin();

    if(loginKeeped){
      this.router.navigate(['/home']);
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
