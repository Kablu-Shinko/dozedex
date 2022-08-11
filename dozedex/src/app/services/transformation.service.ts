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
import { Transformation } from '../interfaces/transformation.interface';

@Injectable({
  providedIn: 'root'
})
export class TransformationService {

    constructor(
        private http: HttpClient,
        private userService: UserService,
        private router: Router,
        private dozedexService: DozedexService,
        private imageService: ImageService
    ) { }   

    transformation_API: string = `${environment.API_URL}/transformation`;

    ngOnInit(): void {}

    SetTransformationKey(key: number): void{
        localStorage.setItem("dozedex_Transformation_key", key.toString());
    }

    GetTransformationKey(): number{
        return Number(localStorage.getItem("dozedex_Transformation_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_Transformation_key", '');
    }

    //for mapping
    MapTransformation(unmapped: any): Transformation[]{
        var list: Transformation[] = [];
        unmapped.forEach( (breed: any) => {
        let {
            Key,
            Name,
            ShortDescription,
            LongDescription,
            ImageUrl,
            Status                
        }: Transformation = breed;

        let aux: Transformation = {
            Key: Key,
            Name: Name,
            ShortDescription: ShortDescription,
            LongDescription: LongDescription,
            ImageUrl: ImageUrl,
            ImagePath: this.imageService.GetFullImageURL(ImageUrl ?? ''),
            Status: Status
        }

        list.push(aux);
        });

        return list;
    }

    Validate(newTransformation: Transformation | undefined): string{
        if( newTransformation === undefined 
            || newTransformation.Key === undefined 
            || newTransformation.Status === undefined) {
            return "Transformação não encontrada";
        }

        if(newTransformation.ShortDescription.length === 0){
            return "Preencha o campo de descrição curta";
        }

        if(newTransformation.Name.length === 0){
            return "Preencha o campo de nome";
        }

        return 'ok';
    }

    async AddTransformation(newTransformation: Transformation | undefined): Promise<string>{
        var validator: string = this.Validate(newTransformation);
        if(!(validator === 'ok')){
            return validator;
        }
        await firstValueFrom(this.http.post(`${this.transformation_API}/add`, newTransformation))
        return "Adicionado";
    }

    async GetAllTransformations(): Promise<Transformation[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.transformation_API}/list`));
        var mapped: Transformation[] = this.MapTransformation(response); 

        return mapped;
    }

    async GetOne(key: number): Promise<Transformation>{
        var response = await firstValueFrom(this.http.post(`${this.transformation_API}/details`, {Key: key}));
        var mapped: Transformation = this.MapTransformation([response])[0];

        return mapped;
    }

    async UpdateTransformation(updatedTransformation: Transformation | undefined): Promise<string>{


        await firstValueFrom(this.http.post(`${this.transformation_API}/update`, updatedTransformation));
        return "Atualizado";
    }

    async Inactive(key: number | undefined): Promise<void>{
        if(key === undefined) {
            alert("chave inválida");
            return;
        }

        let Key: number = key ?? -1;
        var transformation: Transformation = await this.GetOne(Key);

        if(transformation === undefined){
            alert("Transformação não encontrada");
            return;
        }

        transformation.Status = false;
        await this.UpdateTransformation(transformation);
        alert("Excluído");
    }
}
