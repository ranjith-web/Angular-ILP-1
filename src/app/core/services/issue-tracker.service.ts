import { Injectable }   from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders,  }   from '@angular/common/http';
import { Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable, pipe, throwError }   from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';

import { IssueTrackerLists } from '../model/issue-tracker.model';
@Injectable()
export class IssueTrackerService {
  private serviceUrl = 'http://localhost:3000/issueTracker';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  // Redux based variables
  issuesLists: Observable<IssueTrackerLists[]>;
  constructor(private http: HttpClient,
    private store: Store<any>) { 
      this.issuesLists = this.store.select( store => store.issues );
    }
  
  getIssuesLists(): Observable<IssueTrackerLists[]> {
    return this.http.get<IssueTrackerLists[]>(this.serviceUrl).pipe(
      map(res => {
        this.store.dispatch({type:"ISSUES_LISTS", payload:res});
        return res;
      })
    )
  }

  /** POST: add a new hero to the database */
  addIssues (issues): Observable<any> {
    const _model = {
      description: issues.description,
      severity: issues.severity,
      status: issues.status,
      created_date: issues.created_date,
      resolved_date: issues.resolved_date
    };
    return this.http.post<IssueTrackerLists>(this.serviceUrl, _model, this.httpOptions)
    .pipe(
      catchError((error: any) => this.handleError(error))
    );
  }

  updateIssues (_id,issue): Observable<any> {
    return this.http
    .put(this.serviceUrl+"/"+_id, issue)
    .pipe(
      map(response => {
        this.store.dispatch(
          {
            type:"UPDATE_ISSUE", 
            payload:
              {
                id: _id,
                data: issue
              }
          })
        return response;
      })      
    )    
  }

  deleteIssues (_id: string): Observable<any> {
    return this.http
    .delete(this.serviceUrl+"/"+_id)
    .pipe(
      map(response => {
        this.store.dispatch(
          {
            type:"DELETE_ISSUE", 
            payload:
              {
                id: _id
              }
            }
          )
        return response;
      })   
    )    
  }

    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError(
        'Something bad happened; please try again later.');
    };
  
}