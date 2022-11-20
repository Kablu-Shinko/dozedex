import { environment } from '../../environments/environments';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Breed } from '../interfaces/breed.interface';
import { ImageService } from './image.service';

@Injectable({
    providedIn: 'root'
})

export class BreedService implements OnInit{

    constructor(
        private http: HttpClient,
        private imageService: ImageService
    ){}

    breed_API: string = `${environment.API_URL}/breed`;

    ngOnInit(): void {}

    SetBreedKey(key: number): void{
        localStorage.setItem("dozedex_breed_key", key.toString());
    }

    GetBreedKey(): number{
        return Number(localStorage.getItem("dozedex_breed_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_breed_key", '');
    }

    //for mapping
    MapBreed(unmapped: any): Breed[]{
        var list: Breed[] = [];
        unmapped.forEach( (breed: any) => {
            let {
                Key,
                Name,
                Description,
                ImageUrl,
                Status                
            }: Breed = breed;

            let aux: Breed = {
                Key: Key,
                Name: Name,
                Description: Description,
                ImageUrl: ImageUrl,
                ImagePath: this.imageService.GetFullImageURL(ImageUrl ?? ''),
                ShowImage: true,
                Status: Status
            }

            list.push(aux);
        });

        return list;
    }

    async GetAllBreeds(): Promise<Breed[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.breed_API}/list`));
        // var response: any = await firstValueFrom(this.http.get(`${this.breed_API}/list`));
        var mapped: Breed[] = this.MapBreed(response); 

        return mapped;
    }

    Validate(breed: Breed | undefined): string{
        if(breed === undefined 
            || breed.Key === undefined 
            || breed.Status === undefined) {
            return "Raça não encontrada";
        }

        if(breed.Description.length === 0){
            return "Preencha o campo de descrição";
        }

        if(breed.Name.length === 0){
            return "Preencha o campo de nome";
        }

        return "ok";
    }

    async GetOne(key: number): Promise<Breed>{
        var response = await firstValueFrom(this.http.post(`${this.breed_API}/details`, {Key: key}));
        var mapped: Breed = this.MapBreed([response])[0];

        return mapped;
    }

    async AddBreed(newBreed: Breed| undefined): Promise<string>{
        try{
            var validator = this.Validate(newBreed);
            if(!(validator.toLowerCase() === 'ok')){
                return validator;
            }
            
            await firstValueFrom(this.http.post(`${this.breed_API}/add`, newBreed))
            return "Adicionado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao adicionar";
        }
    }

    async UpdateBreed(updatedBreed: Breed | undefined): Promise<string>{
        try{
            var validator = this.Validate(updatedBreed);
            
            if(!(validator.toLowerCase() === 'ok')){
                return validator;
            }
            
            await firstValueFrom(this.http.post(`${this.breed_API}/update`, updatedBreed));
            return "Atualizado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha em atualizar";
        }
    }

    async Inactive(key: number | undefined): Promise<void>{
        if(key === undefined) {
            alert("chave inválida");
            return;
        }

        let Key: number = key ?? -1;
        var breed: Breed = await this.GetOne(Key);

        if(breed === undefined){
            alert("raça não encontrada");
            return;
        }

        breed.Status = false;
        await this.UpdateBreed(breed);
    }
}