import { environment } from '../../environments/environments';
import { Guild } from '../interfaces/guild.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImageService } from './image.service';

@Injectable({
    providedIn: 'root'
})

export class GuildService{
    constructor(
        private http: HttpClient,
        private imageService: ImageService
    ) { }   

    guild_API: string = `${environment.API_URL}/guild`;

    ngOnInit(): void {}

    SetGuildKey(key: number): void{
        localStorage.setItem("dozedex_guild_key", key.toString());
    }

    GetGuildKey(): number{
        return Number(localStorage.getItem("dozedex_guild_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_guild_key", '');
    }

    //for mapping
    MapGuild(unmapped: any): Guild[]{
        var list: Guild[] = [];
        unmapped.forEach( (guild: any) => {
            let {
                Key,
                Name,
                Initials,
                ImageUrl,
                ShortDescription,
                LongDescription,
                Status                
            }: Guild = guild;

            let aux: Guild = {
                Key: Key,
                Initials: Initials,
                Name: Name,
                ImageUrl: ImageUrl,
                ImagePath: this.imageService.GetFullImageURL(ImageUrl ?? ''),
                ShortDescription: ShortDescription,
                LongDescription: LongDescription,
                Status: Status
            }

            list.push(aux);
        });

        return list;
    }

    Validate(newGuild: Guild | undefined): string{
        if( newGuild === undefined 
            || newGuild.Key === undefined 
            || newGuild.Status === undefined) {
            return "Habilidade não encontrada";
        }

        if(newGuild.ShortDescription.length === 0){
            return "Preencha o campo de descrição curta";
        }

        if(newGuild.Name.length === 0){
            return "Preencha o campo de nome";
        }

        return 'ok';
    }

    async AddGuild(newGuild: Guild | undefined): Promise<string>{
        try{
            var validator: string = this.Validate(newGuild);
            if(!(validator === 'ok')){
                return validator;
            }
            await firstValueFrom(this.http.post(`${this.guild_API}/add`, newGuild))
            return "Adicionado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao adicionar";
        }
    }

    async GetAllGuilds(): Promise<Guild[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.guild_API}/list`));
        var mapped: Guild[] = this.MapGuild(response); 

        return mapped;
    }

    async GetOne(key: number): Promise<Guild>{
        var response = await firstValueFrom(this.http.post(`${this.guild_API}/details`, {Key: key}));
        var mapped: Guild = this.MapGuild([response])[0];

        return mapped;
    }

    async UpdateGuild(updatedGuild: Guild | undefined): Promise<string>{
        try{
            await firstValueFrom(this.http.post(`${this.guild_API}/update`, updatedGuild));
            return "Atualizado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao atualizar";
        }
    }

    async Inactive(key: number | undefined): Promise<void>{
        if(key === undefined) {
            alert("chave inválida");
            return;
        }

        let Key: number = key ?? -1;
        var guild: Guild = await this.GetOne(Key);

        if(guild === undefined){
            alert("Habilidade não encontrada");
            return;
        }

        guild.Status = false;
        await this.UpdateGuild(guild);
        alert("Excluído");
    }
}