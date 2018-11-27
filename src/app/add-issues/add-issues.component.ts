import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { Store } from '@ngrx/store';

import { IssueTrackerService } from '../core/services/issue-tracker.service';
import { IssueTrackerLists } from '../core/model/issue-tracker.model';

@Component({
  selector: 'app-add-issues',
  templateUrl: './add-issues.component.html',
  styleUrls: ['./add-issues.component.css']
})
export class AddIssuesComponent implements OnInit {
  model = {
    severity: "Minor",
    description: "",
    status: "Open",
    created_date: "",
    resolved_date: ""
  };
  loader: boolean = false;
  paramsId = "";
  editOrAddButtonDisplay: boolean = false;
  
  constructor(private issueTrackerService: IssueTrackerService,
  private snackBar: MatSnackBar,
  private router: Router,
  private route: ActivatedRoute,
  private store: Store<any> ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.paramsId = params.get("id");
      if(this.paramsId){
        this.issueTrackerService.issuesLists.subscribe(res => {
          if(res.length > 0){
            this.editOrAddButtonDisplay = true;
            const editIssues = res.filter(item => {
              return item.id == this.paramsId;
            });
            
            this.model = {
              severity: editIssues[0].severity,
              description: editIssues[0].description,
              status: editIssues[0].status,
              created_date: editIssues[0].created_date,
              resolved_date: editIssues[0].resolved_date
            };
          }
          
        })
        
      }
    }) 
  }

  updateIssues() {
    this.loader = true;
    const updateItems = this.model
    this.issueTrackerService.updateIssues(this.paramsId, this.model).subscribe(res => {
      this.loader = false;
      let snackBarRef = this.snackBar.open("Issue id"+this.paramsId+" uppdated successfully", "", {
        duration: 2000,
      });
      snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigateByUrl('/tracking');
      });
    })
  }
  createIssues(): void{
    this.loader = true;
    this.issueTrackerService.addIssues(this.model).subscribe(res => {
      this.loader = false;
      let snackBarRef = this.snackBar.open("Issue added successfully", "", {
        duration: 2000,
      });
      snackBarRef.afterDismissed().subscribe(() => {
        this.router.navigateByUrl('/tracking');
      });
    })
    console.log(this.model)
  }
}
