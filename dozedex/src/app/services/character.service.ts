import { environment } from '../../environments/environments';
import { Character } from '../interfaces/character.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImageService } from './image.service';
import { BreedService } from './breed.service';
import { TransformationService } from './transformation.service';
import { SkillService } from './skill.service';
import { GuildService } from './guild.service';
import { ItemService } from './item.service';

@Injectable({
    providedIn: 'root'
})

export class CharacterService{
    constructor(
        private http: HttpClient,
        private imageService: ImageService,
        private breedService: BreedService,
        private transformationService: TransformationService,
        private skillService: SkillService,
        private itemService: ItemService,
        private guildService: GuildService
    ) { }   

    character_API: string = `${environment.API_URL}/character`;

    ngOnInit(): void {}

    SetCharacterKey(key: number): void{
        localStorage.setItem("dozedex_character_key", key.toString());
    }

    GetCharacterKey(): number{
        return Number(localStorage.getItem("dozedex_character_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_character_key", '');
    }

    //for mapping
    async MapCharacter(unmapped: any): Promise<Character[]>{
        var list: Character[] = [];
        try{
            for(let i: number = 0; i < unmapped.length; i++){
                let character: any = unmapped[i];

                let {
                    Key,
                    Name,
                    Age,
                    ShortDescription,
                    LongDescription,
                    HairColor,
                    ImageUrl,
                    Height,
                    Weight,
                    SkinColor,
                    LeftEyeColor,
                    RightEyeColor,
                    Personality,
                    Attachments,
                    BreedKeys,
                    SkillsKeys,
                    ParentsKeys,
                    TransformationKeys,
                    Breed,
                    ItemKeys,
                    Items,
                    Parents,
                    Skills,
                    Transformations,
                    Status                
                }: Character = character;

                let aux: Character = {
                    Key: Key,
                    Age: Age,
                    Name: Name,
                    Personality: Personality,
                    ShortDescription: ShortDescription,
                    LongDescription: LongDescription,
                    ImageUrl: ImageUrl,
                    ImagePath: this.imageService.GetFullImageURL(ImageUrl ?? ''),
                    HairColor: HairColor,
                    SkinColor: SkinColor,
                    LeftEyeColor: LeftEyeColor,
                    RightEyeColor: RightEyeColor,
                    Height: Height,
                    Weight: Weight,
                    BreedKeys: BreedKeys,
                    Attachments: Attachments,
                    ParentsKeys: ParentsKeys,
                    SkillsKeys: SkillsKeys,
                    TransformationKeys: TransformationKeys,
                    Breed: Breed,
                    ItemKeys: ItemKeys,
                    Items: Items,
                    Parents: Parents,
                    Skills: Skills,
                    Transformations: Transformations,
                    Status: Status
                }

                if(aux.Breed === undefined || aux.Breed === null) aux.Breed = [];
                if(aux.Skills === undefined || aux.Skills === null) aux.Skills = [];
                if(aux.Parents === undefined || aux.Parents === null) aux.Parents = [];
                if(aux.Transformations === undefined || aux.Transformations === null) aux.Transformations = [];
                if(aux.Items === undefined || aux.Items === null) aux.Items = [];

                if(aux.Breed.length === 0 && aux.BreedKeys !== undefined && aux.BreedKeys.length > 0){
                    let breedKeys: number[] = aux.BreedKeys;

                    for(let i: number = 0; i < breedKeys.length; i++){
                        let key: number = breedKeys[i];
                        let breed = await this.breedService.GetOne(key);
                        if(breed !== undefined && breed.Key !== undefined && breed.Key > 0) aux.Breed.push(breed);
                    }
                }

                if(aux.Skills.length === 0 && aux.SkillsKeys !== undefined && aux.SkillsKeys.length > 0){
                    let skillsKeys: number[] = aux.SkillsKeys;

                    for(let i: number = 0; i < skillsKeys.length; i++){
                        let key: number = aux.BreedKeys[i];
                        let skill = await this.skillService.GetOne(key);
                        if(skill !== undefined && skill.Key !== undefined && skill.Key > 0) aux.Skills.push(skill);
                    }
                }

                if(aux.Parents.length === 0 && aux.ParentsKeys !== undefined && aux.ParentsKeys.length > 0){
                    let parentsKeys: number[] = aux.ParentsKeys;

                    for(let i: number = 0; i < parentsKeys.length; i++){
                        let key: number = Number(parentsKeys[i]);
                        if(key > 0){
                            let parent = await this.GetOne(key);
                            if(parent !== undefined && parent.Key !== undefined && parent.Key > 0) aux.Parents.push(parent);
                        }
                    }
                }

                if(aux.Transformations.length === 0 && aux.TransformationKeys !== undefined && aux.TransformationKeys.length > 0){
                    let transformations: number[] = aux.TransformationKeys;

                    for(let i: number = 0; i < transformations.length; i++){
                        let key: number = transformations[i];
                        let transformation = await this.transformationService.GetOne(key);
                        if(transformation !== undefined && transformation.Key !== undefined && transformation.Key > 0) aux.Transformations.push(transformation);
                    }
                }

                if(aux.Items.length === 0 && aux.ItemKeys !== undefined && aux.ItemKeys.length > 0){
                    let items: number[] = aux.ItemKeys;

                    for(let i: number = 0; i < items.length; i++){
                        let key: number = items[i];
                        let item = await this.itemService.GetOne(key);
                        if(item !== undefined && item.Key !== undefined && item.Key > 0) aux.Transformations.push(item);
                    }
                }
                
                list.push(aux);
            };
            
            return list;
        }
        catch(ex: any){
            console.log(ex);
            return [];
        }
    }

    Validate(newCharacter: Character | undefined): string{
        if( newCharacter === undefined 
            || newCharacter.Key === undefined 
            || newCharacter.Status === undefined) {
            return "Personagem não encontrado";
        }

        if(newCharacter.ShortDescription.length === 0){
            return "Preencha o campo de descrição curta";
        }

        if(newCharacter.Name.length === 0){
            return "Preencha o campo de nome";
        }

        if(newCharacter.BreedKeys.length === 0){
            return "Precisa de pelo menos uma raça selecionada";
        }

        return 'ok';
    }

    async AddCharacter(newCharacter: Character | undefined): Promise<string>{
        try{
            var validator: string = this.Validate(newCharacter);
            if(!(validator === 'ok')){
                return validator;
            }
            await firstValueFrom(this.http.post(`${this.character_API}/add`, newCharacter))
            return "Adicionado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao adicionar";
        }
    }

    async GetAllCharacters(): Promise<Character[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.character_API}/list`));
        var mapped: Character[] = await this.MapCharacter(response); 

        return mapped;
    }

    async GetOne(key: number): Promise<Character>{
        var response = await firstValueFrom(this.http.post(`${this.character_API}/details`, {Key: key}));
        var mapped: Character = (await this.MapCharacter([response]))[0];

        return mapped;
    }

    async UpdateCharacter(updatedCharacter: Character | undefined): Promise<string>{
        try{
            await firstValueFrom(this.http.post(`${this.character_API}/update`, updatedCharacter));
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
        var character: Character = await this.GetOne(Key);

        if(character === undefined){
            alert("Personagem não encontrado");
            return;
        }

        character.Status = false;
        await this.UpdateCharacter(character);
        alert("Excluído");
    }
}