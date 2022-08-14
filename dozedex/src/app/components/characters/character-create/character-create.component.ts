import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../assets/dialog/dialog.component';
import { Attachment, DialogData, MultiSelect } from 'src/app/interfaces/small-interfaces/small-interfaces';
import { CharacterService } from 'src/app/services/character.service';
import { Character } from 'src/app/interfaces/character.interface';
import { Transformation } from 'src/app/interfaces/transformation.interface';
import { Breed } from 'src/app/interfaces/breed.interface';
import { Skill } from 'src/app/interfaces/skill.interface';
import { BreedService } from 'src/app/services/breed.service';
import { TransformationService } from 'src/app/services/transformation.service';
import { SkillService } from 'src/app/services/skill.service';
import { Item } from 'src/app/interfaces/item.interface';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit {

  constructor(
    private imageService: ImageService,
    private formBuilder: FormBuilder,
    private dozedexService: DozedexService,
    private characterService: CharacterService,
    private router: Router,
    private breedService: BreedService,
    private transformationService: TransformationService,
    private skillService: SkillService,
    private itemService: ItemService,
    public dialog: MatDialog
  ) { }

  Area: string = "";
  Key: number = -1;
  loading: boolean = false;
  characterLoading: boolean = false;
  characterImagePath: string = '';
  loadingUrl: string = this.dozedexService.GetLoadingImage();

  //breed
  breeds: Breed[] = [];
  breedKeys: FormControl = new FormControl('');
  breedMultiSelect: MultiSelect = {
    Title: "Raças",
    List: []
  };

  //parents
  parents: Character[] = [];
  parentsKeys: FormControl = new FormControl('');
  parentsMultiSelect: MultiSelect = {
    Title: "Parentes",
    List: []
  };

  //transformation
  transformations: Transformation[] = [];
  transformationsKeys: FormControl = new FormControl('');
  transformationsMultiSelect: MultiSelect = {
    Title: "Transformações",
    List: []
  };

  //skill
  skills: Skill[] = [];
  skillsKeys: FormControl = new FormControl('');
  skillsMultiSelect: MultiSelect = {
    Title: "Habilidades",
    List: []
  };

  //item
  items: Item[] = [];
  itemsKeys: FormControl = new FormControl('');
  itemsMultiSelect: MultiSelect = {
    Title: "Itens",
    List: []
  };
  
  character: Character = {
    Key: -1,
    Age: '',
    Name: '',
    ShortDescription: '',
    LongDescription: '',
    Appearence: '',
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

  characterForm = this.formBuilder.group({
    Name: [''],
    Age: [''],
    ShortDescription: [''],
    LongDescription: [''],
    Appearence: [''],
    HairColor: [''],
    SkinColor: [''],
    LeftEyeColor: [''],
    RightEyeColor: [''],
    Height: [0],
    Weight: [0],
    Personality: [''],
    BreedKeys: [Array<number>()],
    SkillsKeys: [Array<number>()],
    ParentsKeys: [Array<number>()],
    TransformationKeys: [Array<number>()],
    Attachments: [Array<Attachment>],
    ItemKeys: [Array<number>()],
    ImageUrl: ['']
  });

  async ngOnInit(): Promise<void> {
    this.Area = "";
    this.characterLoading = true;
    this.Key = this.characterService.GetCharacterKey();

    if(this.Key > 0){
      this.Area = "Personagens > Edição";
      this.character = await this.characterService.GetOne(this.Key);
    }
    else{
      this.character.Key = -1;
      this.Area = "Personagens > Criação";
    }

    this.skills = await this.skillService.GetAllSkill();
    this.breeds = await this.breedService.GetAllBreeds();
    this.transformations = await this.transformationService.GetAllTransformations();
    this.items = await this.itemService.GetAllItems();
    this.parents = await this.characterService.GetAllCharactersMinified();

    this.breeds.forEach((breed: Breed) =>{
      this.breedMultiSelect.List.push({
        Title: breed.Name,
        Key: breed.Key ?? -1
      });
    });

    this.parents.forEach((parent: Character) => {
      if(parent.Key !== this.character.Key){
        this.parentsMultiSelect.List.push({
          Title: parent.Name,
          Key: parent.Key ?? -1
        });
      }
    });

    this.transformations.forEach((transformation: Transformation) => {
      this.transformationsMultiSelect.List.push({
        Title: transformation.Name,
        Key: transformation.Key ?? -1
      });
    });

    this.items.forEach((item: Item) => {
      this.itemsMultiSelect.List.push({
        Title: item.Name,
        Key: item.Key ?? -1
      });
    });

    this.skills.forEach((skill: Skill) => {
      this.skillsMultiSelect.List.push({
        Title: skill.Name,
        Key: skill.Key ?? -1
      });
    });

    this.character.ImagePath = this.imageService.GetFullImageURL(this.character.ImagePath ?? '');
    this.characterImagePath = this.character.ImagePath;
    this.InitForm();
    this.characterLoading = false;
  }

  InitForm(): void{
    this.characterForm.controls.Name.setValue(this.character.Name);
    this.characterForm.controls.Age.setValue(this.character.Age ?? "");
    this.characterForm.controls.ShortDescription.setValue(this.character.ShortDescription);
    this.characterForm.controls.LongDescription.setValue(this.character.LongDescription ?? "");
    this.characterForm.controls.Appearence.setValue(this.character.Appearence ?? "");
    this.characterForm.controls.HairColor.setValue(this.character.HairColor ?? "");
    this.characterForm.controls.SkinColor.setValue(this.character.SkinColor ?? "");
    this.characterForm.controls.LeftEyeColor.setValue(this.character.LeftEyeColor ?? "");
    this.characterForm.controls.RightEyeColor.setValue(this.character.RightEyeColor ?? "");
    this.characterForm.controls.Height.setValue(this.character.Height ?? 0);
    this.characterForm.controls.Weight.setValue(this.character.Weight ?? 0);
    this.characterForm.controls.Personality.setValue(this.character.Personality ?? "");
    this.characterForm.controls.BreedKeys.setValue(this.character.BreedKeys ?? Array<number>());
    this.characterForm.controls.SkillsKeys.setValue(this.character.SkillsKeys ?? Array<number>());
    this.characterForm.controls.ParentsKeys.setValue(this.character.ParentsKeys ?? Array<number>());
    this.characterForm.controls.TransformationKeys.setValue(this.character.TransformationKeys ?? Array<number>());
    this.characterForm.controls.ItemKeys.setValue(this.character.ItemKeys ?? Array<number>());
    this.characterForm.controls.ImageUrl.setValue(this.character.ImageUrl ?? "");
  }

  async onSubmit(): Promise<void>{
    this.characterForm.controls.BreedKeys.setValue(this.breedKeys.value);
    this.characterForm.controls.SkillsKeys.setValue(this.skillsKeys.value);
    this.characterForm.controls.ParentsKeys.setValue(this.parentsKeys.value);
    this.characterForm.controls.TransformationKeys.setValue(this.transformationsKeys.value);
    this.characterForm.controls.ItemKeys.setValue(this.itemsKeys.value);

    if(this.characterForm.valid){
      this.loading = true;
      var editedCharacter: Character = {
        Key: this.character.Key,
        Name: this.characterForm.controls.Name.value ?? this.character.Name,
        Age: this.characterForm.controls.Age.value ?? this.character.Age,
        Appearence: this.characterForm.controls.Appearence.value ?? this.character.Appearence,
        Height: this.characterForm.controls.Height.value ?? this.character.Height,
        Weight: this.characterForm.controls.Weight.value ?? this.character.Weight,
        LeftEyeColor: this.characterForm.controls.LeftEyeColor.value ?? this.character.LeftEyeColor,
        RightEyeColor: this.characterForm.controls.RightEyeColor.value ?? this.character.RightEyeColor,
        HairColor: this.characterForm.controls.HairColor.value ?? this.character.HairColor,
        SkinColor: this.characterForm.controls.SkinColor.value ?? this.character.SkinColor,
        BreedKeys: this.characterForm.controls.BreedKeys.value ?? this.character.BreedKeys,
        ParentsKeys: this.characterForm.controls.ParentsKeys.value ?? this.character.ParentsKeys,
        TransformationKeys: this.characterForm.controls.TransformationKeys.value ?? this.character.TransformationKeys,
        ItemKeys: this.characterForm.controls.ItemKeys.value ?? this.character.ItemKeys,
        SkillsKeys: this.characterForm.controls.SkillsKeys.value ?? this.character.SkillsKeys,
        ShortDescription: this.characterForm.controls.ShortDescription.value ?? this.character.ShortDescription,
        LongDescription: this.characterForm.controls.LongDescription.value ?? this.character.LongDescription,
        Personality: this.characterForm.controls.Personality.value ?? this.character.Personality,
        ImageUrl: this.characterForm.controls.ImageUrl.value ?? this.character.ImageUrl,
        Status: this.character.Status
      }

      var result: string = '';
      if(editedCharacter.Key === -1){
        result = await this.characterService.AddCharacter(editedCharacter);
      }
      else{
        result = await this.characterService.UpdateCharacter(editedCharacter);
      }

      await this.dozedexService.RefreshPage(this.router.url);

      alert(result);
      this.loading = false;
      if(result === 'Atualizado' || result === 'Adicionado'){
        this.router.navigate(['character/list']);
      }
      else{
        alert("algo deu errado, tente novamente");
      }
    }
  }

  async SaveUrl(newUrl: string): Promise<string>{
    this.characterForm.controls.ImageUrl.setValue(newUrl);
    var editedCharacter: Character = this.character;
    editedCharacter.ImageUrl = newUrl;

    if(editedCharacter.Key === undefined || editedCharacter.Key === -1 || editedCharacter.Key === null){
      return "Agora complete o cadastro";
    }

    var result = await this.characterService.UpdateCharacter(editedCharacter);
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
          Input: this.characterImagePath,
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
