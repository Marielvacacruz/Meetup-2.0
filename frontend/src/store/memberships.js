import { csrfFetch } from "./csrf";

//constants
const GET_ALL_MEMBERS =  'GET_ALL_MEMBERS';
const ADD_MEMBERSHIP = 'POST_MEMBERSHIP';
const DELETE_MEMBERSHIP = 'DELETE_MEMBERSHIP';

//ACTION CREATORS

const getMembers = (members) => {
    return {
        type: GET_ALL_MEMBERS,
        members
    }
};

const addMember = (member) => {
    return {
        type: ADD_MEMBERSHIP,
        member
    }
};

const deleteMembership = () => {
    return {
        type: DELETE_MEMBERSHIP,
    }
};

//Thunks

//GET ALL MEMBERS
 export const getAllMembers = (groupId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`);

    if(res.ok){
        const data = await res.json();
        dispatch(getMembers(data.Members));
    }
    return res;
 };

 //ADD membership
 export const joinGroup =(groupId) => async(dispatch) => {
    const res = await  csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'POST'
    })

    if(res.ok){
        const member  = await res.json();
        dispatch(addMember(member))
    }
    return res
 };

 //DELETE Membership
 export const leaveGroup =(groupId, memberId) => async(dispatch) => {
    const res = await csrfFetch(`/api/groups/${groupId}/membership`, {
        method: 'DELETE',
        body:  JSON.stringify({memberId}),
    });

    const response = await res.json();
    if(res.status === 200){
        dispatch(deleteMembership(memberId));
    }
    return response;
 };

 const initialState = {};

 //Memberships Reducer
 export default function membershipsReducer(state = initialState, action){
    let newState = {...state};
    switch(action.type){
        case GET_ALL_MEMBERS:
            let members = {};
            action.members.forEach((member) => members[member.id] = member);
            return members;
        case ADD_MEMBERSHIP:
            newState[action.member.memberId] = action.member;
            return newState;
        case DELETE_MEMBERSHIP:
            delete newState[action.memberId];
            return newState;
        default:
            return state;
    };
 };
