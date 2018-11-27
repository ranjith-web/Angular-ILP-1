'use strict';

export function issuesReducer (state: any = [], {type, payload}) {
    switch (type) {
        case 'ISSUES_LISTS':
            return payload;
        case 'ADD_ISSUES':
            return [...state, payload];
        case 'UPDATE_ISSUE':
            return state.map(item => {
                return item.id === payload.id
                  ? Object.assign({}, item, { value: payload.issue })
                  : item;
              });
        case 'DELETE_ISSUE':
            return state.filter(item => item.id !== payload.id);
        default:
            return state;
    }
}