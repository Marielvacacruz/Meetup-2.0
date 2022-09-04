import { useDispatch, useSelector } from "react-redux";
import { useEffect} from "react";
import { getUserGroups, deleteGroupThunk } from "../../store/groups";
import { leaveGroup } from "../../store/memberships";
import GroupCard from "./GroupCard";
import {Link, Redirect, useHistory} from  'react-router-dom';


function MyGroups() {
    const dispatch = useDispatch();
    const history = useHistory();

    const myGroups = useSelector((state) => Object.values(state.groupState));


    useEffect(() => {
        dispatch(getUserGroups());
    },[dispatch]);

    const currentUser = useSelector(state => state.session.user);

    //if current user is logged out, redirect
    if(!currentUser) return (<Redirect to='/'/>);

    //if group card is clicked send user to group details page
    const handleClick = (groupId) => {
        history.push(`/groups/${groupId}`)
    };

    return (
        <div className='groups-page'>
            <h2 className='group-title'>My groups</h2>
            <div className='all-groups-container'>
                {myGroups.map(group => (
                <div key={group.id}>
                    <div key={group.id} onClick={() => handleClick(group.id)}>
                        <GroupCard group={group}/>
                    </div>
                    {currentUser.id  === group.organizerId &&
                    <>
                        <button onClick={() => { dispatch(deleteGroupThunk(group.id)) } } className="delete-group-button">delete</button>
                        <Link to={`/${group.id}/edit`} className="edit-group-link">edit</Link>
                    </>
                    }
                    {currentUser.id !== group.organizerId &&
                    <>
                        <button onClick={() => { dispatch(leaveGroup(group.id, currentUser.id)) } } >leave group</button>
                    </>
                    }
                </div>
                ))}
            </div>
        </div>
    );
};

export default MyGroups;
