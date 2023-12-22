import { MatSelectModule } from '@angular/material/select';
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
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DeckComponent } from './deck/deck.component';
import { CookieInterceptorInterceptor } from './cookie-interceptor.interceptor';
import { StoreComponent } from './store/store/store.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {} from '@microsoft/signalr';
import { StatsComponent } from './stats/stats.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { SlotDialogComponent } from './slot-dialog/slot-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import {} from '@microsoft/signalr';

@NgModule({
  declarations: [	
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CardComponent,
    MatchComponent,
    HomeComponent,
      DeckComponent,
      StoreComponent,
      StatsComponent,
      SlotDialogComponent,
      
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    CanvasJSAngularChartsModule
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
