import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breed } from 'src/app/interfaces/breed.interface';
import { Character } from 'src/app/interfaces/character.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { Skill } from 'src/app/interfaces/skill.interface';
import { Transformation } from 'src/app/interfaces/transformation.interface';
import { AudioService } from 'src/app/services/audio.service';
import { CharacterService } from 'src/app/services/character.service';
import { ImageService } from 'src/app/services/image.service';
import { ItemService } from 'src/app/services/item.service';
import { SkillService } from 'src/app/services/skill.service';
import { TransformationService } from 'src/app/services/transformation.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private characterService: CharacterService,
    private router: Router,
    private transformationService: TransformationService,
    private skillService: SkillService,
    private itemService: ItemService,
    private audioService: AudioService
  ) { }

  Area: string = "";
  Key: number = -1;
  loading: boolean = false;
  characterImagePath: string = '';

  breeds: Breed[] = [];
  parents: Character[] = [];
  transformations: Transformation[] = [];
  skills: Skill[] = [];
  items: Item[] = [];

  haveParents: boolean = false;
  haveItems: boolean = false;
  haveTransformations: boolean = false;
  haveSkills: boolean = false;
  
  character: Character = {
    Key: -1,
    Age: '',
    Name: '',
    ShortDescription: '',
    LongDescription: '',
    ImageUrl: '',
    ImagePath: '',
    HairColor: '',
    LeftEyeColor: '',
    RightEyeColor: '',
    SkinColor: '',
    Personality: '',
    Height: 0,
    Weight: 0,
    Breed: [],
    Skills: [],
    Parents: [],
    Attachments: [],
    Transformations: [],
    BreedKeys: [],
    SkillsKeys: [],
    ParentsKeys: [],
    TransformationKeys: [],
    ItemKeys: [],
    Status: false
  };

  async ngOnInit(): Promise<void> {
    this.Area = "";
    this.loading = true;
    this.Key = this.characterService.GetCharacterKey();

    this.Area = "Personagens > Detalhes";
    this.character = await this.characterService.GetOne(this.Key);
    this.character.ImagePath = this.imageService.GetFullImageURL(this.character.ImagePath ?? '');
    this.characterImagePath = this.character.ImagePath;
    this.haveItems = this.character.Items !== undefined && this.character.Items.length > 0;
    this.haveParents = this.character.Parents !== undefined && this.character.Parents.length > 0;
    this.haveSkills = this.character.Skills !== undefined && this.character.Skills.length > 0;
    this.haveTransformations = this.character.Transformations !== undefined && this.character.Transformations.length > 0;
  
    this.loading = false;
  }

  GoToEdit(key: number | undefined): void{
    this.SelectItem();
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['character/edit']);
  }

  GoToCharacterDetails(key: number | undefined): void{
    this.SelectItem();
    this.characterService.SetCharacterKey(key ?? 0);
    this.router.navigate(['character/details']);
  }

  GoToSkillDetails(key: number | undefined): void{
    this.SelectItem();
    this.skillService.SetSkillKey(key ?? 0);
    this.router.navigate(['skill/create']);
  }

  GoToTransformationDetails(key: number | undefined): void{
    this.SelectItem();
    this.transformationService.SetTransformationKey(key ?? 0);
    this.router.navigate(['transformation/create']);
  }

  GoToItemDetails(key: number | undefined): void{
    this.SelectItem();
    this.itemService.SetItemKey(key ?? 0);
    this.router.navigate(['item/create']);
  }

  GetAppearence(): string {
    let appearence: string = this.character.Appearence ?? '';
    if(appearence.length > 0){
      return appearence;
    }
    else{
      return "Sem aparência descrita";
    }
  }

  GetBreeds(): string{
    let breedName: string = '';
    let _breeds: Breed[] = this.character.Breed ?? [];
    if(_breeds.length > 0){
      if(_breeds.length > 1){

        breedName += 'Híbrido (';
        _breeds.forEach((breed: Breed) => {
          breedName += `${breed.Name}, `;
        });
        breedName = breedName.substring(0, breedName.length -2);
        breedName += ')';
      }
      else{
        breedName = _breeds[0].Name;
      }
    }
    else{
      breedName = "Desconhecida";
    }
    return breedName;
  }

  GetName(): string{
    return this.character.Name;
  }

  GetAge(): string{
    let age: string = this.character.Age ?? '';
    if(age.length > 0){
      return age;
    }
    else{
      return "Desconhecida";
    }
  }

  GetHeight(): string | number{
    let height: number = this.character.Height ?? 0;

    if(height > 0){
      return height;
    }
    else{
      return "Desconhecida";
    }
  }

  GetWeight(): string | number {
    let weight: number = this.character.Weight ?? 0;
    if(weight > 0){
      return weight;
    }
    else{
      return "Desconhecido";
    }
  }

  GetEyes(): string{
    let leftEye: string = this.character.LeftEyeColor ?? '';
    let rightEye: string = this.character.RightEyeColor ?? '';

    if((leftEye !== '') && ((leftEye === rightEye) || (rightEye === ''))){
      return `(L | R) ${leftEye}`;
    }
    else{
      return `(L) ${leftEye} | (R) ${rightEye}`;
    }
  }

  GetHair(): string{
    let hair: string = this.character.HairColor ?? '';

    if(hair.length > 0){
      return hair;
    }
    else{
      return "Desconhecido";
    }
  }

  GetSkin(): string{
    let skin: string = this.character.SkinColor ?? '';

    if(skin.length > 0){
      return skin;
    }
    else{
      return "Desconhecido";
    }
  }

  GetPersonality(): string{
    let personality: string = this.character.Personality ?? '';
    if(personality.length > 0){
      return personality;
    }
    else{
      return "Desconhecida";
    }
  }

  GetHistory(): string{
    let hisroty: string = this.character.LongDescription ?? '';
    if(hisroty.length > 0){
      return hisroty;
    }
    else{
      return "Desconhecida";
    }
  }

  GetDescription(): string{
    let description: string = this.character.ShortDescription ?? '';
    if(description.length > 0){
      return description;
    }
    else{
      return "Desconhecida";
    }
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }
}