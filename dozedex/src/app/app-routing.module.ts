import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterCreateComponent } from './components/characters/character-create/character-create.component';
import { CharacterDetailsComponent } from './components/characters/character-details/character-details.component';
import { CharacterEditComponent } from './components/characters/character-edit/character-edit.component';
import { CharactersListComponent } from './components/characters/characters-list/characters-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'characters/list', component: CharactersListComponent},
  {path: 'characters/edit/:id', component: CharacterEditComponent},
  {path: 'characters/details/:id', component: CharacterDetailsComponent},
  {path: 'characters/create', component: CharacterCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
