//all actions specific to Groups Resource

import { csrfFetch } from "./csrf";

//constants
const GET_ALL_GROUPS =  'GET_ALL_GROUPS';
// const ADD_GROUP = 'ADD_GROUP';
// const UPDATE_GROUP = 'UPDATE_GROUP';
// const DELETE_GROUP = 'DELETE_GROUP';

//action creators
const getGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups,
    }
};

//GET all Groups thunk
export const getAllGroups = () => async (dispatch) => {
    const res = await csrfFetch('/api/groups');

    if(res.ok){
        const data = await res.json();
        dispatch(getGroups(data.Groups));
    }
    return res;
};

const initialState = {};

//Groups Reducer
export default function groupsReducer(state = initialState, action){
    let newState = {...state};
    switch(action.type){
        case GET_ALL_GROUPS:
            action.groups.forEach((group) => newState[group.id] = group);
            return newState;
        default:
            return state;
    };
};
