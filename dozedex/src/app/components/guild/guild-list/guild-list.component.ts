import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guild } from 'src/app/interfaces/guild.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { GuildService } from 'src/app/services/guild.service';

@Component({
  selector: 'app-guild-list',
  templateUrl: './guild-list.component.html',
  styleUrls: ['./guild-list.component.css']
})
export class GuildListComponent implements OnInit {

  constructor(
    private guildService: GuildService,
    private router: Router,
    private dozedexService: DozedexService
  ) { }

  Area: string = "Guildas";
  guilds: Guild[] = [];
  fullList: Guild[] = [];

  async ngOnInit(): Promise<void> {
    var list: Guild[] = await this.guildService.GetAllGuilds();
    this.fullList = list;
    this.guilds = list;
  } 

  SearchGuild(search: string){
    this.guilds = [];

    this.fullList.forEach((guild: Guild) =>{
      if((guild.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (guild.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.guilds.push(guild);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.guildService.SetGuildKey(key ?? 0);
    this.router.navigate(['guild/create']);
  }

  GoToDetails(key: number | undefined): void{
    this.guildService.SetGuildKey(key ?? 0);
    this.router.navigate(['guild/details']);
  }

  AddNew(){
    this.guildService.ResetKey();
    this.router.navigate(['guild/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    await this.guildService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }
}
