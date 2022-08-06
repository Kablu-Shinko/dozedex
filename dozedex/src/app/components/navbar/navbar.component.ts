import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuOption } from 'src/app/interfaces/small-interfaces/small-interfaces';
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

  altText: string = "imagem de perfil";
  showFiller: Boolean =  false;
  path: string = this.userService.getImageURL();

  menuOptions: MenuOption[] = [
    {
      Title: "Início",
      Function: () => this.router.navigate(['home'])  
    },
    {
      Title: "Personagens",
      Function: () => this.router.navigate(['/characters/list'])
    },
    {
      Title: "Raças",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Mundos",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Itens",
      Function: () => this.dozedexService.notImplemented()
    }
  ];

  profileOptions: MenuOption[] = [
    {
      Title: "Meu Perfil",
      Function: () => this.router.navigate(['/user/profile'])
    },
    {
      Title: "Sair",
      Function: () => this.logOut()
    }
  ];
    
  ngOnInit(): void {
  };

  logOut(): void{
    this.dozedexService.logOut();
  };

  ReloadPage(): void{
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        alert("Atualizado");
    });
  };

  goToCharacters(): void{
    this.router.navigate(['/characters/list']);
  };


}
