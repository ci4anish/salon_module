import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { SalonInfoService } from './services/salon-info.service';
import { BookModuleService } from './services/book-module.service';
import { ProfessionalInfoService } from './services/professional-info.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SalonDetailsComponent } from './components/salon-details/salon-details.component';
import { SalonServicesComponent } from './components/salon-services/salon-services.component';
import { HeaderComponent } from './components/header/header.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioButton,
  MatRadioGroup,
  MatRippleModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './components/map/map.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { CommentsComponent } from './components/comments/comments.component';
import { TypePickerComponent } from './components/type-picker/type-picker.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { BookModuleComponent } from './components/book-module/book-module.component';
import {SliderComponent} from './components/slider/slider.component';
import { NguCarouselModule } from '@ngu/carousel';

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
    TypePickerComponent,
    DatePickerComponent,
    BookModuleComponent,
    SliderComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRippleModule,
    BarRatingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NguCarouselModule
  ],
  providers: [SalonInfoService, BookModuleService, ProfessionalInfoService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
