import {useDispatch, useSelector} from 'react-redux';
import { getAllGroups } from '../../store/groups';
import {useEffect} from 'react';
import GroupCard from './GroupCard';

function GroupsPage () {
    const dispatch = useDispatch();
    const allGroups = useSelector((state) => Object.values(state.groupState));

    useEffect(() => {
        dispatch(getAllGroups())
    },[dispatch]);

    return(
        <div>
            <h2>Groups</h2>
            <div>
                {allGroups.map(group => (
                <div key={group.id}>
                    <GroupCard group={group}/>
                </div>
                ))}
            </div>

        </div>
    );


};

export default GroupsPage;
