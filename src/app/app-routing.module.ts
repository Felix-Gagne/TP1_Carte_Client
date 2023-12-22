import { DeckComponent } from './deck/deck.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { MatchComponent } from './match/match.component';
import { HomeComponent } from './home/home.component';
import { StoreComponent } from './store/store/store.component';
import { StatsComponent } from './stats/stats.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'store', component: StoreComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'match/:playerid', component: MatchComponent},
  { path: 'deck', component: DeckComponent },
  { path: '', component: HomeComponent },
  { path: 'stats', component: StatsComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
