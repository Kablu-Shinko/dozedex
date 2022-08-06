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

  user: User = this.userService.GetActualUser();

  ngOnInit(): void{

    if(!this.user.KeepLogin){
      this.router.navigate(['/login']);
    }
    else if(this.dozedexService.getLastPath().length > 0){
      this.router.navigate([this.dozedexService.getLastPath()]);
    }
    else{
      this.router.navigate(['/home']);
    }
  }
}
