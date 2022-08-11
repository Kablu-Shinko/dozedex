import { environment } from '../../environments/environments';
import { User } from '../interfaces/user.interface'
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { interval, firstValueFrom } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { Breed } from '../interfaces/breed.interface';
import { DozedexService } from './dozedex.service';
import { ImageService } from './image.service';

@Injectable({
    providedIn: 'root'
})

export class BreedService implements OnInit{

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: Router,
        private dozedexService: DozedexService,
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
        var validator = this.Validate(newBreed);

        if(!(validator.toLowerCase() === 'ok')){
            return validator;
        }

        await firstValueFrom(this.http.post(`${this.breed_API}/add`, newBreed))

        return "Adicionado";
    }

    async UpdateBreed(updatedBreed: Breed | undefined): Promise<string>{
        var validator = this.Validate(updatedBreed);

        if(!(validator.toLowerCase() === 'ok')){
            return validator;
        }

        await firstValueFrom(this.http.post(`${this.breed_API}/update`, updatedBreed));
        return "Atualizado";
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