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
import { Breed } from '../interfaces/breed.interface';
import { Transformation } from '../interfaces/transformation.interface';
import { Item } from '../interfaces/item.interface';
import { Skill } from '../interfaces/skill.interface';

@Injectable({
    providedIn: 'root'
})

export class CharacterService{
    constructor(
        private http: HttpClient,
        private imageService: ImageService
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
                    Appearence,
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
                    Appearence: Appearence,
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

                if(aux.Breed !== undefined && aux.Breed.length > 0){
                    aux.Breed.forEach((breed: Breed) => {
                        breed.ImagePath = this.imageService.GetFullImageURL(breed.ImageUrl ?? '');
                    });
                }

                if(aux.Parents !== undefined && aux.Parents.length > 0){
                    aux.Parents.forEach((parent: Character) => {
                        parent.ImagePath = this.imageService.GetFullImageURL(parent.ImageUrl ?? '');
                    });
                }

                if(aux.Transformations !== undefined && aux.Transformations.length > 0){
                    aux.Transformations.forEach((transformation: Transformation) => {
                        transformation.ImagePath = this.imageService.GetFullImageURL(transformation.ImageUrl ?? '');
                    });
                }
                
                if(aux.Items !== undefined && aux.Items.length > 0){
                    aux.Items.forEach((item: Item) => {
                        item.ImagePath = this.imageService.GetFullImageURL(item.ImageUrl ?? '');
                    });
                }

                if(aux.Skills !== undefined && aux.Skills.length > 0){
                    aux.Skills.forEach((skill: Skill) => {
                        skill.ImagePath = this.imageService.GetFullImageURL(skill.ImageUrl ?? '');
                    });
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

    async GetAllCharactersMinified(): Promise<Character[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.character_API}/minifiedList`));
        var mapped: Character[] = await this.MapCharacter(response); 

        return mapped;
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

    async GetOneMinified(key: number): Promise<Character>{
        var response = await firstValueFrom(this.http.post(`${this.character_API}/minified`, {Key: key}));
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