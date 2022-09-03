import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { getUserGroups, deleteGroupThunk } from "../../store/groups";
import GroupCard from "./GroupCard";
import {Link, Redirect} from  'react-router-dom';


function MyGroups() {
    const dispatch = useDispatch();
    const myGroups = useSelector((state) => Object.values(state.groupState));

    useEffect(() => {
        dispatch(getUserGroups())
    },[dispatch]);


    const currentUser = useSelector(state => state.session.user);

    //if current user is logged out, redirect
    if(!currentUser) return (<Redirect to='/'/>);

    return (
        <div className='groups-page'>
            <h2 className='group-title'>My groups</h2>
            <div className='all-groups-container'>
                {myGroups.map(group => (
                <div key={group.id}>
                    <GroupCard group={group}/>
                    {currentUser.id  === group.organizerId &&
                        <>
                            <button onClick={() => { dispatch(deleteGroupThunk(group.id)); } } className="delete-group-button">delete</button>
                            <Link to={`/${group.id}/edit`} className="edit-group-link">edit</Link>
                        </>
                   }
                </div>
                ))}
            </div>
        </div>
    );
};

export default MyGroups;
