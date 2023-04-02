import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item.interface';
import { AudioService } from 'src/app/services/audio.service';
import { DozedexService } from 'src/app/services/dozedex.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

  constructor(
    private itemService: ItemService,
    private router: Router,
    private dozedexService: DozedexService,
    private audioService: AudioService
  ) { }

  Area: string = "Itens";
  items: Item[] = [];
  fullList: Item[] = [];
  loading: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loading = true;
    var list: Item[] = await this.itemService.GetAllItems();
    this.fullList = list;
    this.items = list;
    this.loading = false;
  } 

  SearchItem(search: string){
    this.items = [];

    this.fullList.forEach((item: Item) =>{
      if((item.Name.toLowerCase().indexOf(search.toLowerCase()) != -1)
        || (item.ShortDescription.toLowerCase().indexOf(search.toLowerCase()) != -1)
      ){
        this.items.push(item);
      }
    })
  }
  
  GoToEdit(key: number | undefined): void{
    this.SelectItem();
    this.itemService.SetItemKey(key ?? 0);
    this.router.navigate(['item/edit']);
  }

  GoToDetails(key: number | undefined): void{
    this.SelectItem();
    this.itemService.SetItemKey(key ?? 0);
    this.router.navigate(['item/details']);
  }

  AddNew(){
    this.SelectItem();
    this.itemService.ResetKey();
    this.router.navigate(['item/create']);
  }

  async Inactive(key: number | undefined): Promise<void>{
    this.SelectItem();
    await this.itemService.Inactive(key);
    await this.dozedexService.RefreshPage(this.router.url);
  }

  SelectItem(): void {
    this.audioService.SelectItem();
  }

  ChangeItem(): void {
    this.audioService.ChangeItem();
  }

}
