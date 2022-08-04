import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private dozedexService: DozedexService,
    private router: Router
    ) { }

  altText: string = "imagem do luan"
  showFiller: Boolean =  false;
  path: string = this.userService.getUserImageURL();

  options: {
    Title: string,
    Function: Function
  }[] = [
    {
      Title: "Início",
      Function: () => this.router.navigate(['home'])  
    },
    {
      Title: "Personagens",
      Function: () => this.router.navigate(['/characters/list'])
    }
  ] 
    
  ngOnInit(): void {
  }

  logOut(): void{
    this.dozedexService.logOut();
  }

  goToCharacters(): void{
    this.router.navigate(['/characters/list']);
  }
}
