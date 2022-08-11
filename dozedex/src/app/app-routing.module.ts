import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { BreedCreateComponent } from './components/breed/breed-create/breed-create.component';
import { BreedListComponent } from './components/breed/breed-list/breed-list.component';
import { CharacterCreateComponent } from './components/characters/character-create/character-create.component';
import { CharacterDetailsComponent } from './components/characters/character-details/character-details.component';
import { CharactersListComponent } from './components/characters/characters-list/characters-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { TransformationCreateComponent } from './components/transformation/transformation-create/transformation-create.component';
import { TransformationDetailsComponent } from './components/transformation/transformation-details/transformation-details.component';
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
    GetTransformationRoutes()
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
    {path: 'characters/list', component: CharactersListComponent},
    {path: 'characters/details', component: CharacterDetailsComponent},
    {path: 'characters/create', component: CharacterCreateComponent}
  ];

  return routes;
}

function GetTransformationRoutes(): Route[]{
  var routes: Route[] = [
    {path: 'transformation/list', component: TransformationListComponent},
    {path: 'transformation/create', component: TransformationCreateComponent},
    {path: 'transformation/details', component: TransformationDetailsComponent}
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

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(GetRoutes(), {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
