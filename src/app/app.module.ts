import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {SalonDetailsComponent} from './components/salon-details/salon-details.component';
import {SalonServicesComponent} from './components/salon-services/salon-services.component';
import {HeaderComponent} from './components/header/header.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {FormsModule} from '@angular/forms';
import {FooterComponent} from './components/footer/footer.component';
import {MatCheckboxModule, MatListModule, MatRadioButton, MatRadioGroup, MatRippleModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MapComponent} from './components/map/map.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import {BarRatingModule} from 'ngx-bar-rating';
import { CommentsComponent } from './components/comments/comments.component';

@NgModule({
  declarations: [
    AppComponent,
    SalonDetailsComponent,
    SalonServicesComponent,
    HeaderComponent,
    FooterComponent,
    MatRadioButton,
    MatRadioGroup,
    MapComponent,
    StarRatingComponent,
    CommentsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    BarRatingModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
