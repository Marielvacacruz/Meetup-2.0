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
    const [isLoaded, setIsLoaded] = useState(false);

    const group = useSelector((state) => state.groupState[`${groupId}`]);
    const members  = useSelector((state) => Object.values(state.membersState));
    const currentUser  = useSelector(state => state.session.user);
    //const status = useSelector((state)  =>  state.membersState[`${currentUser.id}`].Membership.status);

   useEffect(() => {
    dispatch(getGroupDetails(groupId))
    .then(() => dispatch(getAllMembers(groupId)).then(() => setIsLoaded(true)))
   },[dispatch, groupId]);



   const handleClick = () => {
     if(currentUser){
        return dispatch(joinGroup(groupId))
        .then(async (res) => {
            if(res.status === 200) setMessage('Your request was received, your status is pending')
        })
        .catch(async (res) => {
            const data = await res.json();
            setMessage(data.message)
        })
    }else{
        history.push('/login')
     }
   };

    return isLoaded && (
        <div className='details-container'>
            <div className="banner-div">
                <img src='https://media.istockphoto.com/id/1202344480/vector/crowd-of-young-and-elderly-men-and-women-in-trendy-hipster-clothes-diverse-group-of-stylish.webp?s=612x612&w=is&k=20&c=sDS8HuUo4kzDHxgHRlbyWYoNiFIyWTAmSZh8eWUJKi4='
                alt="group placeholder"
                className="placeholder-image"
                />
                <button onClick={handleClick} className='join-group-button'>
                    Join group
                </button>
                {message && (<div className='message-display'>{message}</div>)}
            </div>
            <div className='info-container'>
                <h2 id='group-name'>{group.name}</h2>
                <p id='group-location'>{group.city}, {group.state} <i className="fa-solid fa-location-dot"></i></p>
                <p id='group-type'>this group meets: {group.type}</p>
                <p id='group-about'>{group.about}</p>
            </div>
            <div className='members'>
                <h3>Organizer</h3>
                {group.Organizer.firstName}
                <h3>Members</h3>
            {members.map(member => (
                <div className='member-container' key={member.id}>
                    {member.firstName}
                    <i className="fa-solid fa-circle-user"></i>
                </div>
            ))}
            </div>
        </div>
    );
};

export default GroupDetails;
