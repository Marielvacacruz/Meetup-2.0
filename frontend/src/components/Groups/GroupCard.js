function GroupCard({group}){

    const  {name, city, state, about, numMembers} = group;
    return(

        <div className='card'>
            <div className="banner-container">
                <img src='https://media.istockphoto.com/id/1202344480/vector/crowd-of-young-and-elderly-men-and-women-in-trendy-hipster-clothes-diverse-group-of-stylish.webp?s=612x612&w=is&k=20&c=sDS8HuUo4kzDHxgHRlbyWYoNiFIyWTAmSZh8eWUJKi4='
                alt="group placeholder"
                className="placeholder-image"
                />
            </div>
            <div className="info-container">
                <h3>{name}</h3>
                <p>{city}, {state}</p>
                <p>{about}</p>
                <p>{`${numMembers} Members -- ${group.private ? "Private" : 'Public'}`}</p>
            </div>
        </div>
    )
};
 export default GroupCard;
