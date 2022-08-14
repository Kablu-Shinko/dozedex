import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { BreedCreateComponent } from './components/breed/breed-create/breed-create.component';
import { BreedListComponent } from './components/breed/breed-list/breed-list.component';
import { CharacterCreateComponent } from './components/characters/character-create/character-create.component';
import { CharacterDetailsComponent } from './components/characters/character-details/character-details.component';
import { CharactersListComponent } from './components/characters/characters-list/characters-list.component';
import { GuildCreateComponent } from './components/guild/guild-create/guild-create.component';
import { GuildListComponent } from './components/guild/guild-list/guild-list.component';
import { HomeComponent } from './components/home/home.component';
import { ItemCreateComponent } from './components/item/item-create/item-create.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { LoginComponent } from './components/login/login.component';
import { SkillCreateComponent } from './components/skill/skill-create/skill-create.component';
import { SkillListComponent } from './components/skill/skill-list/skill-list.component';
import { TransformationCreateComponent } from './components/transformation/transformation-create/transformation-create.component';
import { TransformationListComponent } from './components/transformation/transformation-list/transformation-list.component';
import { UserProfileComponent } from './components/User/user-profile/user-profile.component';

const routes: Routes = [];

function PushRoutes(itens: Array<Route[]>): void{
  itens.forEach((_routes: Route[]) => {
    _routes.forEach((route: Route) => {
      routes.push(route);
    });
  });
}

function GetRoutes(): Routes{
  PushRoutes([
    GetDefaultRoutes(),
    GetUserRoutes(),
    GetCharacterRoutes(),
    GetBreedRoutes(),
    GetTransformationRoutes(),
    GetSkillRoutes(),
    GetItemRoutes(),
    GetGuildRoutes()
  ]);

  return routes;
}

function GetDefaultRoutes(): Route[]{
  var routes: Route[] = [
    {path: 'login', component: LoginComponent},
    {path: 'home', component: HomeComponent}
  ]

  return routes;
}

function GetUserRoutes(): Route[]{
  var routes: Route[] = [
    {path: 'user/profile', component: UserProfileComponent}
  ];

  return routes;
}

function GetCharacterRoutes(): Route[]{
  var routes: Route[] = [
    {path: 'character/list', component: CharactersListComponent},
    {path: 'character/details', component: CharacterDetailsComponent},
    {path: 'character/create', component: CharacterCreateComponent}
  ];

  return routes;
}

function GetTransformationRoutes(): Route[]{
  var routes: Route[] = [
    {path: 'transformation/list', component: TransformationListComponent},
    {path: 'transformation/create', component: TransformationCreateComponent}
  ]

  return routes;
}

function GetBreedRoutes(): Route[]{
  var routes: Route[] = [
    {path: "breed/list", component: BreedListComponent},
    {path: "breed/create", component: BreedCreateComponent},
  ];

  return routes;
}

function GetSkillRoutes(): Route[]{
  var routes: Route[] = [
    {path: "skill/list", component: SkillListComponent},
    {path: "skill/create", component: SkillCreateComponent},
  ];

  return routes;
}

function GetItemRoutes(): Route[]{
  var routes: Route[] = [
    {path: "item/list", component: ItemListComponent},
    {path: "item/create", component: ItemCreateComponent},
  ];

  return routes;
}

function GetGuildRoutes(): Route[]{
  var routes: Route[] = [
    {path: "guild/list", component: GuildListComponent},
    {path: "guild/create", component: GuildCreateComponent},
  ];

  return routes;
}

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(GetRoutes(), {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
