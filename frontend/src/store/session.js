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
        user
    }
};

const removeUser = () =>  {
    return {
        type: REMOVE_USER,
    }
};

//login thunk function
export const login = (user) => async (dispatch) => {
    const {credential, password} = user;
    const res = await csrfFetch('/api/session/login', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        }),
    });
    const data = await res.json();
    dispatch(setUser(data.user));
    return res;
};

const initialState = { user: null };

export default function sessionReducer(state = initialState, action){
    let newState = {...state};
    switch(action.type){
        case SET_USER:
            newState.user = action.user;
            return newState;
        case REMOVE_USER:
            newState.user = null;
            return newState;
        default:
            return state;

    }
};
