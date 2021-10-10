import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from "primeng/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from "primeng/calendar";
import { SliderModule } from 'primeng/slider';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import {RippleModule} from "primeng/ripple";
import { HttpClientModule } from "@angular/common/http";
import { SplitButtonModule } from 'primeng/splitbutton';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { MainComponent } from "./main/main.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    OverlayPanelModule,
    ButtonModule,
    BrowserAnimationsModule,
    InputTextModule,
    SliderModule,
    FormsModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    MultiSelectModule,
    HttpClientModule,
    RippleModule,
    SplitButtonModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ReactiveFormsModule,
    ConfirmDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
