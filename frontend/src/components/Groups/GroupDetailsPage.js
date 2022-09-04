import {useDispatch, useSelector} from 'react-redux';
import { getGroupDetails } from '../../store/groups';
import { getAllMembers, joinGroup } from '../../store/memberships';
import {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';

function  GroupDetails(){
    const dispatch = useDispatch();
    const history = useHistory();
    const {groupId} = useParams();

    const [message, setMessage] = useState('');

    const group = useSelector((state) => state.groupState[`${groupId}`]);
    const members  = useSelector((state) => Object.values(state.membersState));
    const currentUser  = useSelector(state => state.session.user);

   useEffect(() => {
    dispatch(getGroupDetails(groupId))
    dispatch(getAllMembers(groupId))
   },[]);

   const handleClick = () => {
     if(currentUser){
        return dispatch(joinGroup(groupId))
        .then(async (res) => {
            if(res.status === 200) setMessage('Your request was received, organizer will approve asap')
        })
        .catch(async (res) => {
            const data = await  res.json();
            if(data.status === 400) setMessage('there was an error')
        })
    }else{
        history.push('/login')
     }
   };

    return(
        <div className='details-container'>
            <div className="banner-container">
                <img src='https://media.istockphoto.com/id/1202344480/vector/crowd-of-young-and-elderly-men-and-women-in-trendy-hipster-clothes-diverse-group-of-stylish.webp?s=612x612&w=is&k=20&c=sDS8HuUo4kzDHxgHRlbyWYoNiFIyWTAmSZh8eWUJKi4='
                alt="group placeholder"
                className="placeholder-image"
                />
            </div>
            {group.name}
           <button onClick={handleClick}>Join this group</button>
           {message && (<div>{message}</div>)}
           <div className='all-members'>
            {members.map(member => (
                <span key={member.id}>
                    {member.firstName}
                </span>
            ))}
           </div>
        </div>
    );
};

export default GroupDetails;
