//contains all actions specific to session user's info
    //including session user's Redux reducer

import {csrfFetch} from './csrf';

//constants
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

//action creators
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
};

const removeUser = () =>  {
    return {
        type: REMOVE_USER,
    }
};

//login thunk function
export const login = (user) => async (dispatch) => {
    const res = await csrfFetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    if(res.ok){
        const data = await res.json();
        dispatch(setUser(data));
    }
    return res;

};

//restore session user thunk
export const restoreUser = () => async (dispatch) => {
    const res = await csrfFetch('/api/users/current')
    const data = await res.json();
    dispatch(setUser(data));
    return res;
};

//Signup User thunk
export const signupUser = (user) => async (dispatch) => {
    const res = await csrfFetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    const data = await res.json();
    dispatch(setUser(data));
    return res;
};

//logout user thunk
export const logout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session/logout', {
        method: 'DELETE',
    });
    
    if(res.ok){
        dispatch(removeUser())
    };
        return res;
};


const initialState = { user: null };

export default function sessionReducer(state = initialState, action){
    let newState = {...state};
    switch(action.type){
        case SET_USER:
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:
            newState.user = null;
            return newState;
        default:
            return state;

    }
};
