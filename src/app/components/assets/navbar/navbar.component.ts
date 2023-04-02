import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion, MenuOption } from '../../../interfaces/small-interfaces/small-interfaces';
import { DozedexService } from '../../../services/dozedex.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user.interface'
import { AudioService } from 'src/app/services/audio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private dozedexService: DozedexService,
    private router: Router,
    private audioService: AudioService
  ) { }

  @Input() ActualArea: string = 'ESQUECEU DE PASSAR O INPUT DE AREA SEU CORNO';
  @Input() AreaAction: Function = () => {};
  @Input() HaveAreaAction: boolean = false;
  @Input() AreaActionTitle: string = '';
  
  user: User = this.userService.GetUser();
  altText: string = "imagem de perfil";
  showFiller: Boolean =  false;
  loading: Boolean = false;
  AppVersion: AppVersion = {
    ActualVersion: this.dozedexService.GetLocalVersion(),
    ServerVersion: '0.0.0',
    IsUpdated: true
  };

  menuOptions: MenuOption[] = [
    {
      Title: "Início",
      Function: () => this.router.navigate(['home'])  
    },
    {
      Title: "Personagens",
      Function: () => this.router.navigate(['character/list'])
    },
    {
      Title: "Raças",
      Function: () => this.router.navigate(['breed/list'])
    },
    {
      Title: "Habilidades",
      Function: () => this.router.navigate(['skill/list'])
    },
    {
      Title: "Transformações",
      Function: () => this.router.navigate(['transformation/list'])
    },
    {
      Title: "Itens",
      Function: () => this.router.navigate(['item/list'])
    },
    {
      Title: "Guildas/Grupos",
      Function: () => this.router.navigate(['guild/list'])
    },
    {
      Title: "Curiosidades",
      Function: () => this.dozedexService.notImplemented()
    },
    {
      Title: "Drive (4Shared)",
      Function: () => this.router.navigate(['dozedex/drive'])
    }
  ];

  profileOptions: MenuOption[] = this.GetProfileOptions()
    
  ngOnInit(): void {
    this.dozedexService.VerifyLogin();
    this.dozedexService.addCurrentPath(this.router.url);
    this.GetAppVersion();
  };

  GetProfileOptions(): MenuOption[] {
    return [
      {
        Title: "Meu Perfil",
        Function: () => this.router.navigate(['/user/profile'])
      },
      {
        Title: this.audioService.soundEnabled ? "Desabilitar sons" : "Habilitar sons",
        Function: () => this.EnableSound()
      },
      {
        Title: "Sair",
        Function: () => this.logOut()
      }
    ];
  }

  EnableSound(): void {
    this.audioService.EnableSound();
    this.profileOptions = this.GetProfileOptions();
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  logOut(): void{
    this.dozedexService.logOut();
  };

  async RefreshPage(): Promise<void>{
    this.loading = true;
    await this.dozedexService.RefreshPage(this.router.url);
    this.loading = false;
    alert("Atualizado");
  };

  async GetAppVersion(): Promise<void> {
    this.AppVersion = await this.dozedexService.VerifyAppVersion();
  }

  goToCharacters(): void{
    this.router.navigate(['/characters/list']);
  };
}
