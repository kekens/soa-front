import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {SecondaryComponent} from "./components/secondary/secondary.component";

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'secondary', component: SecondaryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
