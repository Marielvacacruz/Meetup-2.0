import {useDispatch, useSelector} from 'react-redux';
import { getAllGroups } from '../../store/groups';
import {useEffect} from 'react';
import GroupCard from './GroupCard';
import {useHistory} from 'react-router-dom';

function GroupsPage () {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => Object.values(state.groupState));
    const history = useHistory();

    useEffect(() => {
        dispatch(getAllGroups())
    },[dispatch]);

    //if group card clicked, send user to group details
    const handleClick = (groupId) => {
        history.push(`/groups/${groupId}`)
    };

    return(
        <div className='groups-page'>
            <h2 className='group-title'>Groups</h2>
            <div className='all-groups-container'>
                {allGroups.map(group => (
                <div key={group.id} onClick={() => handleClick(group.id)}>
                    <GroupCard group={group}/>
                </div>
                ))}
            </div>
        </div>
    );


};

export default GroupsPage;
