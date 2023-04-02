import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Guild } from 'src/app/interfaces/guild.interface';
import { AudioService } from 'src/app/services/audio.service';
import { CharacterService } from 'src/app/services/character.service';
import { GuildService } from 'src/app/services/guild.service';

@Component({
  selector: 'app-guild-details',
  templateUrl: './guild-details.component.html',
  styleUrls: ['./guild-details.component.css']
})
export class GuildDetailsComponent implements OnInit {

  constructor(
    private guildService: GuildService,
    private router: Router,
    private characterService: CharacterService,
    private audioService: AudioService
  ) { }

  loading: boolean = false;
  Area: string = "Guildas e Grupos > Detalhes";
  Key: number = -1;
  HaveMembers: boolean = false;
  NameWithInitials: string = '';

  guild: Guild = {
    Name: '',
    ShortDescription: '',
    ImagePath: '',
    ImageUrl: '',
    Initials: '',
    Key: -1,
    CharacterKeys: [],
    Characters: [],
    LongDescription: '',
    Status: false
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.Key = this.guildService.GetGuildKey();

    if(this.Key > 0){
      this.guild = await this.guildService.GetOne(this.Key);
      this.HaveMembers = this.guild.Characters !== undefined && this.guild.Characters.length > 0
    }
    else{
      alert('Grupo ou Guilda inválida');
      this.router.navigate(['guild/list']);
    }

    this.NameWithInitials = this.guild.Initials !== undefined && this.guild.Initials.length > 0 ? `${this.guild.Name} (${this.guild.Initials})` : this.guild.Name;
    
    this.loading = false;
  }

  GoToCharacterDetails(key: number | undefined): void{
    this.SelectItem();
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['character/details']);
  }

  GoToEdit(key: number | undefined): void{
    this.SelectItem();
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['guild/edit']);
  }

  GetHistory(): string{
    let hisroty: string = this.guild.LongDescription ?? '';
    if(hisroty.length > 0){
      return hisroty;
    }
    else{
      return "Desconhecida";
    }
  }

  GetDescription(): string{
    let description: string = this.guild.ShortDescription ?? '';
    if(description.length > 0){
      return description;
    }
    else{
      return "Desconhecida";
    }
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }
}
