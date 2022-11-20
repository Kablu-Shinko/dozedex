import { environment } from '../../environments/environments';
import { Item } from '../interfaces/item.interface';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ImageService } from './image.service';

@Injectable({
    providedIn: 'root'
})

export class ItemService{
    constructor(
        private http: HttpClient,
        private imageService: ImageService
    ) { }   

    item_API: string = `${environment.API_URL}/item`;

    ngOnInit(): void {}

    SetItemKey(key: number): void{
        localStorage.setItem("dozedex_item_key", key.toString());
    }

    GetItemKey(): number{
        return Number(localStorage.getItem("dozedex_item_key") ?? '0');
    }

    ResetKey(): void{
        localStorage.setItem("dozedex_item_key", '');
    }

    //for mapping
    MapItem(unmapped: any): Item[]{
        var list: Item[] = [];
        unmapped.forEach( (item: any) => {
            let {
                Key,
                Name,
                ShortDescription,
                LongDescription,
                ImageUrl,
                Status                
            }: Item = item;

            let aux: Item = {
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

    Validate(newItem: Item | undefined): string{
        if( newItem === undefined 
            || newItem.Key === undefined 
            || newItem.Status === undefined) {
            return "Habilidade não encontrada";
        }

        if(newItem.ShortDescription.length === 0){
            return "Preencha o campo de descrição curta";
        }

        if(newItem.Name.length === 0){
            return "Preencha o campo de nome";
        }

        return 'ok';
    }

    async AddItem(newItem: Item | undefined): Promise<string>{
        try{
            var validator: string = this.Validate(newItem);
            if(!(validator === 'ok')){
                return validator;
            }
            await firstValueFrom(this.http.post(`${this.item_API}/add`, newItem))
            return "Adicionado";
        }
        catch(ex: any){
            console.log(ex);
            return "Falha ao adicionar";
        }
    }

    async GetAllItems(): Promise<Item[]>{
        var response: any = await firstValueFrom(this.http.get(`${this.item_API}/list`));
        var mapped: Item[] = this.MapItem(response); 

        return mapped;
    }

    async GetOne(key: number): Promise<Item>{
        var response = await firstValueFrom(this.http.post(`${this.item_API}/details`, {Key: key}));
        var mapped: Item = this.MapItem([response])[0];

        return mapped;
    }

    async UpdateItem(updatedItem: Item | undefined): Promise<string>{
        try{
            await firstValueFrom(this.http.post(`${this.item_API}/update`, updatedItem));
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
        var item: Item = await this.GetOne(Key);

        if(item === undefined){
            alert("Habilidade não encontrada");
            return;
        }

        item.Status = false;
        await this.UpdateItem(item);
        alert("Excluído");
    }
}