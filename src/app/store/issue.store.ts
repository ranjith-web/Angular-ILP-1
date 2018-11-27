import { IssueTrackerLists } from '../core/model/issue-tracker.model';

export interface AppStore {
    issues: IssueTrackerLists[];
}