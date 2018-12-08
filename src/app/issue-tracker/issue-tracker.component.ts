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
  displayedColumns: any = ['select','description', 'severity', 'status', 'created_date', 'resolved_date', 'action'];
  issueColumns = [
    {name: 'Description', col: 'description', checked:false, _index: "1"},
    {name: 'Severity', col: 'severity', checked:false, _index: "2"},
    {name: 'Status', col: 'status', checked:false, _index: "3"},
    {name: 'Created Date', col: 'created_date', checked:false, _index: "4"},
    {name: 'Resolved Date', col: 'resolved_date', checked:false, _index: "5"}
  ];
  selectedColumns = [];
  loader : boolean = false;
  selection = new SelectionModel<IssueTrackerLists[]>(true, []);
  issueItems = [];
  count = 0;

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

  /* To Hide the columns from the issue table */
  changed(item){
    this.count = 0;    
    const _index = this.search(item.col, this.displayedColumns);  
    if(item.checked){
        this.displayedColumns.splice(_index,1);
      }else{
        this.displayedColumns.splice([item._index], "0", item.col);
      }
  }

 search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i] === nameKey) {
            return i;
        }
    }
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
      this.issueTrackerService.deleteIssues(this.selection.selected[i]["id"]).subscribe(res => {
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