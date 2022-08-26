import React from "react";
import {NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

function Navigation({ isLoaded }) {
    const currentUser = useSelector(state => state.session.user);

    let sessionLinks;
       //if current user render logout button & ProfileButton component
    if(currentUser) {
        sessionLinks = (<ProfileButton user={currentUser}/>)
    } else {
        //if no current user render login and signup nav links
        sessionLinks = (
            <>
                <NavLink to='/login'>Log in</NavLink>
                <NavLink to='/signup'>Sign up</NavLink>
            </>
        );
    }
    //render unordered list with nav link to homepage
    return (
        <ul>
            <li>
                <NavLink exact to='/'>Home</NavLink>
                {isLoaded && sessionLinks}
            </li>
        </ul>
    );





};

export default Navigation;
