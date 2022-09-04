import {useDispatch, useSelector} from 'react-redux';
import { getGroupDetails } from '../../store/groups';
import { getAllMembers, joinGroup } from '../../store/memberships';
import {useEffect} from 'react';
import {useParams} from 'react-router-dom';

function  GroupDetails(){
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector((state) => state.groupState[`${groupId}`]);
    const members  = useSelector((state) => Object.values(state.membersState));

   useEffect(() => {
    dispatch(getGroupDetails(groupId))
    dispatch(getAllMembers(groupId))
   },[]);

   const handleClick = () => {
     const currentUser  = useSelector(state => state.session.user);
     if(currentUser){
        dispatch(joinGroup(groupId))
        .then(console.log('request successful'))
     }else{
        
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

           <button onClick={handleClick}>Join this group</button>
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
