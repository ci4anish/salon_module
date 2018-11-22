import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonDetailsComponent } from './components/salon-details/salon-details.component';
import { BookModuleComponent } from './components/book-module/book-module.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'salon/3',
    pathMatch: 'full'
  },
  {path: 'salon/:id', component: SalonDetailsComponent},
  {path: 'book-module', component: BookModuleComponent},
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {
}
