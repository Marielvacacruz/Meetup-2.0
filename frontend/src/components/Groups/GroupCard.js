
function GroupCard(group){
    const  {previewImage, name, city, state, about, numMembers} = group;
    return(

        <div className='card'>
            <img alt='preview group'>{previewImage}</img>
            <div className="info-container">
                <h2>{name}</h2>
                <p>{city}, {state}</p>
                <p>{about}</p>
                <p>{numMembers} Members</p>
            </div>
        </div>
    )
};
 export default GroupCard;
