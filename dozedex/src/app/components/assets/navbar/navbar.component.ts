import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuOption } from '../../../interfaces/small-interfaces/small-interfaces';
import { DozedexService } from '../../../services/dozedex.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface'

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

  @Input() ActualArea: string = 'ESQUECEU DE PASSAR O INPUT DE AREA SEU CORNO';
  user: User = this.userService.GetActualUser();
  altText: string = "imagem de perfil";
  showFiller: Boolean =  false;
  loading: Boolean = false;

  menuOptions: MenuOption[] = [
    {
      Title: "Início",
      Function: () => this.router.navigate(['home'])  
    },
    {
      Title: "Personagens",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Raças",
      Function: () => this.router.navigate(['breed/list'])
    },
    {
      Title: "Habilidades",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Transformações",
      Function: () => this.router.navigate(['transformation/list'])
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
    this.dozedexService.VerifyLogin();
    this.dozedexService.addCurrentPath(this.router.url);
  };

  logOut(): void{
    this.dozedexService.logOut();
  };

  async RefreshPage(): Promise<void>{
    this.loading = true;
    await this.dozedexService.RefreshPage(this.router.url);
    this.loading = false;
    alert("Atualizado");
  };

  goToCharacters(): void{
    this.router.navigate(['/characters/list']);
  };
}
