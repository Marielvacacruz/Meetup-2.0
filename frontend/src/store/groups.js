//all actions specific to Groups Resource

import { csrfFetch } from "./csrf";

//constants
// const ADD_GROUP = 'ADD_GROUP';
const GET_ALL_GROUPS =  'GET_ALL_GROUPS';
// const UPDATE_GROUP = 'UPDATE_GROUP';
// const DELETE_GROUP = 'DELETE_GROUP';


//action creators
const getAllGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        payload: groups
    }
};

//GET all Groups thunk
export const getGroups = () => async (dispatch) => {
    const res = await csrfFetch('/api/groups');
    const data = await res.json();
  
    dispatch(getAllGroups(data.Groups));
    return res;
};

const initialState = {};

//Groups Reducer
export default function groupsReducer(state = initialState, action){
    let newSate = {...state};
    switch(action.type){
        case GET_ALL_GROUPS:
            newSate = action.payload;
            return newSate;
        default:
            return state;
    };
};
