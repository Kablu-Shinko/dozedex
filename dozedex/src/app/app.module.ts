//angular base modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

//imports angular material
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

//environments
import { environment } from '../environments/environment';

//components
import { NavbarComponent } from './components/assets/navbar/navbar.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { CharactersListComponent } from './components/characters/characters-list/characters-list.component';
import { CharacterCreateComponent } from './components/characters/character-create/character-create.component';
import { CharacterDetailsComponent } from './components/characters/character-details/character-details.component';
import { UserProfileComponent } from './components/User/user-profile/user-profile.component';
import { PulsingButtonComponent } from './components/assets/buttons/pulsing-button/pulsing-button.component';
import { BottombarComponent } from './components/assets/bottombar/bottombar.component';
import { DialogComponent } from './components/assets/dialog/dialog.component';
import { BreedListComponent } from './components/breed/breed-list/breed-list.component';
import { BreedCreateComponent } from './components/breed/breed-create/breed-create.component';
import { DozedexSpacerComponent } from './components/assets/dozedex-spacer/dozedex-spacer.component';
import { TransformationCreateComponent } from './components/transformation/transformation-create/transformation-create.component';
import { TransformationListComponent } from './components/transformation/transformation-list/transformation-list.component';
import { SkillCreateComponent } from './components/skill/skill-create/skill-create.component';
import { SkillListComponent } from './components/skill/skill-list/skill-list.component';
import { GuildListComponent } from './components/guild/guild-list/guild-list.component';
import { GuildCreateComponent } from './components/guild/guild-create/guild-create.component';
import { ItemCreateComponent } from './components/item/item-create/item-create.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,
    CharactersListComponent,
    CharacterCreateComponent,
    CharacterDetailsComponent,
    UserProfileComponent,
    PulsingButtonComponent,
    BottombarComponent,
    DialogComponent,
    BreedListComponent,
    BreedCreateComponent,
    DozedexSpacerComponent,
    TransformationCreateComponent,
    TransformationListComponent,
    SkillCreateComponent,
    SkillListComponent,
    GuildListComponent,
    GuildCreateComponent,
    ItemCreateComponent,
    ItemListComponent
  ],
  imports: [
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,

    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
