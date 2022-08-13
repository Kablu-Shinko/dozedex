import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { DialogData } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { GuildService } from 'src/app/services/guild.service';
import { Guild } from 'src/app/interfaces/guild.interface';

@Component({
  selector: 'app-guild-create',
  templateUrl: './guild-create.component.html',
  styleUrls: ['./guild-create.component.css']
})
export class GuildCreateComponent implements OnInit {
  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private guildService: GuildService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = 0;
  loading: boolean = false;
  guildImagePath: string = '';
  
  guild: Guild = {
    ShortDescription: '',
    ImagePath: '',
    Name: '',
    Initials: '',
    LongDescription: '',
    ImageUrl: '',
    Key: -1,
    Status: false
  };

  guildForm = this.formBuilder.group({
    Name: [''],
    ShortDescription: [''],
    LongDescription: [''],
    Initials: ['']
  });

  async ngOnInit(): Promise<void> {
    this.Area = "";
    this.Key = this.guildService.GetGuildKey();

    if(this.Key > 0){
      this.Area = "Guildas > Edição";
      this.guild = await this.guildService.GetOne(this.Key);
    }
    else{
      this.Area = "Guildas > Criação";
    }

    this.guild.ImagePath = this.imageService.GetFullImageURL(this.guild.ImagePath ?? '');
    this.guildImagePath = this.guild.ImagePath;
    this.InitForm();
  }

  InitForm(): void{
    this.guildForm.controls.Name.setValue(this.guild.Name);
    this.guildForm.controls.ShortDescription.setValue(this.guild.ShortDescription);
    this.guildForm.controls.LongDescription.setValue(this.guild.LongDescription ?? "");
    this.guildForm.controls.Initials.setValue(this.guild.Initials ?? '');
  }

  async onSubmit(): Promise<void>{
    if(this.guildForm.valid){
      this.loading = true;
      var editedGuild: Guild = {
        Name: this.guildForm.controls.Name.value ?? this.guild.Name,
        ImageUrl: this.guild.ImageUrl,
        Initials: this.guildForm.controls.Initials.value ?? this.guild.Initials,
        ShortDescription: this.guildForm.controls.ShortDescription.value ?? this.guild.ShortDescription,
        LongDescription: this.guildForm.controls.LongDescription.value ?? this.guild.LongDescription,
        ImagePath: '',
        Key: this.guild.Key ?? -1,
        Status: this.guild.Status ?? false
      }

      var result: string = '';

      if(editedGuild.Key === -1){
        result = await this.guildService.AddGuild(editedGuild);
      }
      else{
        result = await this.guildService.UpdateGuild(editedGuild);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
    }
    else{
      alert("Verifique os campos e tente novamente")
    }
    this.loading = false;
    this.router.navigate(['guild/list']);
  }

  async SaveUrl(newUrl: string): Promise<string>{
    var editedGuild: Guild = {
      Name: this.guild.Name,
      ImageUrl: newUrl,
      ShortDescription: this.guild.ShortDescription,
      LongDescription: this.guild.LongDescription,
      Initials: this.guild.Initials,
      Key: this.guild.Key,
      Status: this.guild.Status,
      ImagePath: this.guild.ImagePath
    }

    if(editedGuild.Key === undefined || editedGuild.Key === -1){
      this.guild.ImageUrl = newUrl;
      return "agora complete o cadastro";
    }

    var result = await this.guildService.UpdateGuild(editedGuild);
    await this.dozedexService.RefreshPage(this.router.url);

    return result;
  }

  openDialog(): void {
    const data: DialogData = {
      Title: "Trocar url da imagem",
      Description: "insira abaixo a url da nova imagem",
      FunctionDescription: "Atualizar",
      Inputs: [
        {
          Label: "Nova URL",
          Input: this.guildImagePath,
          Type: "text"
        }
      ],
      Function: async (inputs: string[]) => { 
        let response = await this.SaveUrl(inputs[0]); 
        this.dialog.closeAll();
        return response; 
      }
    }
    
    this.dialog.open(DialogComponent, {
      width: '400px',
      data: data
    });
  }
}
