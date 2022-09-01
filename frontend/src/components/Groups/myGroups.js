import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { getUserGroups, deleteGroupThunk } from "../../store/groups";
import GroupCard from "./GroupCard";
import {Redirect} from  'react-router-dom';


function MyGroups() {
    const dispatch = useDispatch();
    const myGroups = useSelector((state) => Object.values(state.groupState));

    useEffect(() => {
        dispatch(getUserGroups())
    },[dispatch]);

    const currentUser = useSelector(state => state.session.user);

    //if current user is logged out, redirect
    if(!currentUser) return (<Redirect to='/'/>);


//    const  editGroup = (e) => {
//         e.preventDefault();
//         dispatch(updateGroup())
//    }

    return (
        <div className='groups-page'>
            <h2 className='group-title'>My groups</h2>
            <div className='all-groups-container'>
                {myGroups.map(group => (
                <div key={group.id}>
                    <GroupCard group={group}/>
                    <button onClick={() => {dispatch(deleteGroupThunk(group.id))}} className="delete-group-button">delete</button>
                    <button className="edit-group-button">edit</button>
                </div>
                ))}
            </div>
        </div>
    );
};

export default MyGroups;
