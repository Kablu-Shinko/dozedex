import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Skill } from 'src/app/interfaces/skill.interface';
import { DozedexService } from 'src/app/services/dozedex.service';
import { SkillService } from 'src/app/services/skill.service';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.css']
})
export class SkillListComponent implements OnInit {

  constructor(
    private skillService: SkillService,
    private router: Router,
    private dozedexService: DozedexService
  ) { }

  Area: string = "Habilidades";
  skills: Skill[] = [];
  fullList: Skill[] = [];

  async ngOnInit(): Promise<void> {
    var list: Skill[] = await this.skillService.GetAllSkill();
    this.fullList = list;
    this.skills = list;
  } 

  SearchSkill(search: string){
    this.skills = [];

    this.fullList.forEach((skill: Skill) =>{
      if((skill.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (skill.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.skills.push(skill);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.skillService.SetSkillKey(key ?? 0);
    this.router.navigate(['skill/create']);
  }

  GoToDetails(key: number | undefined): void{
    this.skillService.SetSkillKey(key ?? 0);
    this.router.navigate(['skill/details']);
  }

  AddNew(){
    this.skillService.ResetKey();
    this.router.navigate(['skill/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    await this.skillService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }
}
