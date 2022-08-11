import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardOption, Card } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { DozedexService } from 'src/app/services/dozedex.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
      private router: Router,
      private dozedexService: DozedexService,
      private userService: UserService
    ) { }

  Area: string = "Página inicial";
  
  Cards: Card[] = [
    {
      Title: "Personagens",
      Options: [
        {
          Title: "Lista",
          Hover: "Lista de personagens",
          Function: () => this.dozedexService.notImplemented()
        }
      ]
    },
    {
      Title: "Raças",
      Options: [
        {
          Title: "Lista",
          Hover: "Lista de raças conhecidas",
          Function: () => this.router.navigate(['/breed/list'])
        }
      ]
    },
    {
      Title: "Mundos",
      Options: [
        {
          Title: "Lista",
          Hover: "Mundos atualmente conhecidos e seu estado atual",
          Function: () => this.dozedexService.notImplemented()
        }
      ]
    },
    {
      Title: "Itens",
      Options: [
        {
          Title: "Lista",
          Hover: "Itens conhecidos",
          Function: () => this.dozedexService.notImplemented()
        }
      ]
    }
  ]

  ngOnInit(): void {
  }

  navigateTo(route: string){
    this.router.navigate([route]);
  }
}
