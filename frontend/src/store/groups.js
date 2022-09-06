//all actions specific to Groups Resource

import { csrfFetch } from "./csrf";

//constants
const GET_ALL_GROUPS =  'GET_ALL_GROUPS';
const GET_USER_GROUPS = 'GET_USER_GROUPS';
const GET_GROUP_DETAILS = 'GET_GROUP_DETAILS';
const ADD_GROUP = 'ADD_GROUP';
const UPDATE_GROUP = 'UPDATE_GROUP';
const DELETE_GROUP = 'DELETE_GROUP';


//action creators
const getGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups,
    }
};

const getMyGroups = (groups) => {
    return {
        type: GET_USER_GROUPS,
        groups
    }
};

const getAGroup =(group)  =>  {
    return {
        type: GET_GROUP_DETAILS,
        group
    }
};

const addGroup = (group) => {
    return {
        type: ADD_GROUP,
        group,
    }
};

const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
};

const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId,
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

//GET GROUPS that user organized or belongs to
export const getUserGroups = () => async(dispatch) => {
    const res = await csrfFetch('api/users/current/groups');

    if(res.ok){
        const data = await res.json();
        dispatch(getMyGroups(data.Groups))
    }
};

//GET DETAILS of a Group
export const getGroupDetails = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`);

    if(res.ok){
        const group = await res.json();
        dispatch(getAGroup(group));
        return res
    };
};

//CREATE a NEW GROUP thunk
export const createGroup = (group) => async(dispatch) => {
    const {name, about, type, city, state} = group;

    const res = await csrfFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify({
            name,
            about,
            type,
            city,
            state,
        }),

    });
    if(res.ok){
        const newGroup = await res.json();
        dispatch(addGroup(newGroup))
        return res
    };
};

//UPDATE GROUP thunk
export const editGroup = (group, id) => async (dispatch) => {
    const res = await csrfFetch(`/api/groups/${id}`, {
        method: 'PUT',
        body: JSON.stringify(group),
    });
    if(res.ok){
        const updatedGroup = await res.json();
        dispatch(updateGroup(updatedGroup))
        return res
    }
};

//DELETE Group thunk
export const deleteGroupThunk = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });
    const response = await res.json();
    if(res.status === 200){
        dispatch(deleteGroup(groupId));
    }
    return response;
};

const initialState = {};

//Groups Reducer
export default function groupsReducer(state = initialState, action){
    let newState = {...state};
    switch(action.type){
        case GET_ALL_GROUPS:
            action.groups.forEach((group) => newState[group.id] = group);
            return newState;
        case GET_USER_GROUPS:
            action.groups.forEach((group) => newState[group.id]= group);
            return newState;
        case GET_GROUP_DETAILS:
            newState[action.group.id] = action.group;
            return newState;
        case ADD_GROUP:
            newState[action.group.id] = action.group
            return newState;
        case UPDATE_GROUP:
            newState[action.group.id] = action.group
            return newState;
        case DELETE_GROUP:
            delete newState[action.groupId];
            return newState;
        default:
            return state;
    };
};
