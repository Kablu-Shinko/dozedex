import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatLegacyOption as MatOption } from '@angular/material/legacy-core';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { MultiSelect, MultiSelectOption } from 'src/app/interfaces/small-interfaces/small-interfaces';


@Component({
  selector: 'app-multi-select-input',
  templateUrl: './multi-select-input.component.html',
  styleUrls: ['./multi-select-input.component.css']
})
export class MultiSelectInputComponent implements OnInit{
  
  @Input() multiSelectForm: FormControl = new FormControl('');
  @Input() multiSelect: MultiSelect = {
    Title: 'Sem título',
    List: []
  };

  @Input() selectedValues: number[] = [];

  selectList: MultiSelectOption[] = [];
  selectedList: MultiSelectOption[] = [];
  fullList: MultiSelectOption[] = [];
  defaultOption: MultiSelectOption = {
    Key: -1,
    Title: "Sem opções"
  }

  ngOnInit(): void{
    this.fullList = this.multiSelect.List;
    this.selectList = this.fullList;
    if(this.selectedValues.length > 0){
      this.multiSelectForm.setValue(this.selectedValues);
    }
  }

  GetOptionName(id: number | undefined | string): string{
    if(id !== undefined){
      try{
        let _id: number = Number(id);
        let option = this.fullList.find(f => f.Key == _id);
        if(option !== undefined && option !== null){
          return option.Title.length > 12 ? `${option.Title.substring(0,12)}...` : option.Title;
        }
        else{
          return "";
        }
      }
      catch{
        return "";
      }
    }
    else{
      return "";
    }
  }

  //pegar os que são compativeis com a pesquisa
  //depois adicionar os demais na lista
  filter(search: string): void{
    
    let optionsList: MultiSelectOption[] = [];

    this.fullList.forEach((option: MultiSelectOption) =>{
      if((option.Title.toLowerCase().indexOf(search.toLowerCase()) != -1)){
        optionsList.push(option);
      }
    });

    this.fullList.forEach((option: MultiSelectOption) =>{
      if(optionsList.indexOf(option) === -1){
        optionsList.push(option);
      }
    });

    this.selectList = optionsList;
  }
}
