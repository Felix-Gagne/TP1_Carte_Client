import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './authentification/login/login.component';
import { RegisterComponent } from './authentification/register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { CardComponent } from './card/card.component';
import { MatchComponent } from './match/match.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeckComponent } from './deck/deck.component';
import { CookieInterceptorInterceptor } from './cookie-interceptor.interceptor';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [	
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CardComponent,
    MatchComponent,
    HomeComponent,
    DeckComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CookieInterceptorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
