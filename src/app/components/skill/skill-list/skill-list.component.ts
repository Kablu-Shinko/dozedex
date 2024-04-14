import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Skill } from 'src/app/interfaces/skill.interface';
import { AudioService } from 'src/app/services/audio.service';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ImageService } from 'src/app/services/image.service';
import { SkillService } from 'src/app/services/skill.service';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit {

  Area: string = "Habilidades";
  skills: Skill[];
  fullList: Skill[];
  defaultSkillImageUri: string;
  loading: boolean = false;

  constructor(
    private skillService: SkillService,
    private router: Router,
    private dozedexService: DozedexService,
    private imageService: ImageService,
    private audioService: AudioService
  ) {
    this.skills = [];
    this.fullList = [];
    this.defaultSkillImageUri = "";
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Skill[] = await this.skillService.GetAllSkill();
    this.fullList = list;
    this.skills = list;
    this.defaultSkillImageUri = this.imageService.DefaultSkillImageURI;
    this.MapSkills();
    this.loading = false;
  }

  MapSkills(): void {
    this.skills.forEach((skill: Skill) => {
      skill.ImagePath = this.imageService.GetFullImageURL(skill.ImageUrl ?? this.imageService.DefaultSkillImageURI);
      skill.ImageUrl = this.imageService.GetFullImageURL(skill.ImageUrl ?? this.imageService.DefaultSkillImageURI)
    });
  }

  SearchSkill(search: string) {
    this.skills = [];

    this.fullList.forEach((skill: Skill) => {
      if ((skill.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (skill.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ) {
        this.skills.push(skill);
      }
    })
  }

  GoToEdit(key: number | undefined): void {
    this.SelectItem();
    this.skillService.SetSkillKey(key ?? 0);
    this.router.navigate(['skill/edit']);
  }

  GoToDetails(key: number | undefined): void {
    this.SelectItem();
    this.skillService.SetSkillKey(key ?? 0);
    this.router.navigate(['skill/details']);
  }

  AddNew() {
    this.SelectItem();
    this.skillService.ResetKey();
    this.router.navigate(['skill/create']);
  }

  async Inactive(key: number | undefined): Promise<void> {
    this.SelectItem();
    await this.skillService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }
}
