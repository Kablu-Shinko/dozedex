import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guild } from 'src/app/interfaces/guild.interface';
import { AudioService } from 'src/app/services/audio.service';
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
    private dozedexService: DozedexService,
    private audioService: AudioService
  ) { }

  Area: string = "Guildas e Grupos";
  guilds: Guild[] = [];
  fullList: Guild[] = [];
  loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Guild[] = await this.guildService.GetAllGuildsMinified();

    list.forEach((guild: Guild) => {
      if(guild.Initials !== undefined && guild.Initials.length > 0){
        guild.Name += ` (${guild.Initials})`;
      }
    }); 

    this.fullList = list;
    this.guilds = list;
    this.loading = false;
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
    this.SelectItem();
    this.guildService.SetGuildKey(key ?? 0);
    this.router.navigate(['guild/edit']);
  }

  GoToDetails(key: number | undefined): void{
    this.SelectItem();
    this.guildService.SetGuildKey(key ?? 0);
    this.router.navigate(['guild/details']);
  }

  AddNew(){
    this.SelectItem();
    this.guildService.ResetKey();
    this.router.navigate(['guild/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    this.SelectItem();
    await this.guildService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }
}
