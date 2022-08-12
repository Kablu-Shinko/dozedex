import { environment } from '../../environments/environments';
import { Skill } from '../interfaces/skill.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SkillService{
    constructor(
        private http: HttpClient
    ) { }   

    skill_API: string = `${environment.API_URL}/skill`;

    ngOnInit(): void {}

    SetSkillKey(key: number): void{
        localStorage.setItem("dozedex_skill_key", key.toString());
    }

    GetSkillKey(): number{
        return Number(localStorage.getItem("dozedex_skill_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_skill_key", '');
    }

    //for mapping
    MapSkill(unmapped: any): Skill[]{
        var list: Skill[] = [];
        unmapped.forEach( (skill: any) => {
            let {
                Key,
                Name,
                ShortDescription,
                LongDescription,
                Status                
            }: Skill = skill;

            let aux: Skill = {
                Key: Key,
                Name: Name,
                ShortDescription: ShortDescription,
                LongDescription: LongDescription,
                Status: Status
            }

            list.push(aux);
        });

        return list;
    }

    Validate(newSkill: Skill | undefined): string{
        if( newSkill === undefined 
            || newSkill.Key === undefined 
            || newSkill.Status === undefined) {
            return "Habilidade não encontrada";
        }

        if(newSkill.ShortDescription.length === 0){
            return "Preencha o campo de descrição curta";
        }

        if(newSkill.LongDescription.length === 0){
            return "Preencha o campo de descrição longa";
        }

        if(newSkill.Name.length === 0){
            return "Preencha o campo de nome";
        }

        return 'ok';
    }

    async AddSkill(newSkill: Skill | undefined): Promise<string>{
        var validator: string = this.Validate(newSkill);
        if(!(validator === 'ok')){
            return validator;
        }
        await firstValueFrom(this.http.post(`${this.skill_API}/add`, newSkill))
        return "Adicionado";
    }

    async GetAllSkill(): Promise<Skill[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.skill_API}/list`));
        var mapped: Skill[] = this.MapSkill(response); 

        return mapped;
    }

    async GetOne(key: number): Promise<Skill>{
        var response = await firstValueFrom(this.http.post(`${this.skill_API}/details`, {Key: key}));
        var mapped: Skill = this.MapSkill([response])[0];

        return mapped;
    }

    async UpdateSkill(updatedSkill: Skill | undefined): Promise<string>{
        await firstValueFrom(this.http.post(`${this.skill_API}/update`, updatedSkill));
        return "Atualizado";
    }

    async Inactive(key: number | undefined): Promise<void>{
        if(key === undefined) {
            alert("chave inválida");
            return;
        }

        let Key: number = key ?? -1;
        var skill: Skill = await this.GetOne(Key);

        if(skill === undefined){
            alert("Habilidade não encontrada");
            return;
        }

        skill.Status = false;
        await this.UpdateSkill(skill);
        alert("Excluído");
    }
}