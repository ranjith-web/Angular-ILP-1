import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import  'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IssueTrackerComponent } from './issue-tracker/issue-tracker.component';
import { AddIssuesComponent } from './add-issues/add-issues.component';

import { issuesReducer } from './store/issues.reducer';

@NgModule({
  declarations: [
    AppComponent,
    IssueTrackerComponent,
    AddIssuesComponent
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({
      issues:issuesReducer
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
