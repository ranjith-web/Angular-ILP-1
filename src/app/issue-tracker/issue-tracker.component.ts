import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { IssueTrackerService } from '../core/services/issue-tracker.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { startWith, tap, delay } from 'rxjs/operators';

import {DataSource} from '@angular/cdk/collections';
import { IssueTrackerLists } from '../core/model/issue-tracker.model';

@Component({
  selector: 'app-issue-tracker',
  templateUrl: './issue-tracker.component.html',
  styleUrls: ['./issue-tracker.component.css']
})
export class IssueTrackerComponent implements OnInit, AfterViewInit {
  dataSource: IssueTrackerDataSource;
  displayedColumns = ['select','description', 'severity', 'status', 'created_date', 'resolved_date', 'action'];
  loader : boolean = false;
  selection = new SelectionModel<IssueTrackerLists[]>(true, []);
  issueItems = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(private issueTrackerService: IssueTrackerService,
  private router: Router,
  private snackBar: MatSnackBar,
  private store: Store<any>) {
    //this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.loader = true;
    this.dataSource = new IssueTrackerDataSource(this.issueTrackerService);
    this.issueTrackerService.getIssuesLists().subscribe(res => {
      this.loader = false;
      this.dataSource.loadTable(res);
    })
  }
  
  ngAfterViewInit(){
    this.loader = true;
    this.issueTrackerService.issuesLists
    .pipe(
      startWith(null),
      delay(0),
      tap((res) => {
        this.loader = false;
        this.dataSource.loadTable(res);
        this.issueItems = res;
      })
    ).subscribe();
  }
/** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.issueItems.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.issueItems.forEach(row => this.selection.select(row));
    }
    
  applyFilter(filterValue: string) {
    this.dataSource.loadTable(this.dataSource.filterPredicate(this.issueItems, filterValue));
  }
  addIssues(): void{
    this.router.navigateByUrl('/add-issues');
  }
  updateIssue(_id): void{
    this.router.navigateByUrl('/edit-issues/'+_id);
  }
  deleteIssues(): void{
    this.loader = true;
    for(var i = 0; i < this.selection.selected.length; i++){
      this.issueTrackerService.deleteIssues(this.selection.selected[i].id).subscribe(res => {
        this.loader = false;
        let snackBarRef = this.snackBar.open("Issued Deleted successfully", "", {
          duration: 2000,
        });
      })
    }    
  }
}


export class IssueTrackerDataSource extends DataSource<any> {
  entityObject = new BehaviorSubject([]);

  constructor(private issueTrackerService: IssueTrackerService) {
    super();
  }
  connect(): Observable<IssueTrackerLists[]> {
    return this.entityObject.asObservable();
  }

  loadTable(payload){
    this.entityObject.next(payload);
  }
  disconnect() {
    this.entityObject.complete();
  }
  filterPredicate(data, filter: string): boolean {
    return data.filter(item => {
      return item.description.toLowerCase().indexOf(filter.toLowerCase()) != -1 || item.status.toLowerCase().indexOf(filter.toLowerCase()) != -1 || item.severity.toLowerCase().indexOf(filter.toLowerCase()) != -1;
    })
  };
}