import React from "react";
import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

function Navigation({ isLoaded }) {
    const currentUser = useSelector(state => state.session.user);

    let sessionLinks
       //if current user render logout button & ProfileButton component
    if(currentUser) {
        sessionLinks = (<ProfileButton user={currentUser}/>)
    } else {
        //if no current user render login and signup nav links
        sessionLinks = (
            <div className="nav-link-container">
                <NavLink className='nav-link' to='/login'>Log in</NavLink>
                <NavLink className='nav-link' to='/signup'>Sign up</NavLink>
            </div>
        );
    }
    //render unordered list with nav link to homepage
    return (
        <div className="Navigation-container">
            <div>
                <NavLink className='meetup-nav' exact to='/'>Meetup</NavLink>
            </div>
                {isLoaded && sessionLinks}
        </div>

    )

};

export default Navigation;
