import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { Link } from "react-router-dom";


export default function ProfileButton ({user}) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu ] = useState(false);

    //dropdown menu
    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
      };

      useEffect(() => {
        if (!showMenu) return;

        const closeMenu = () => {
          setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);

      //dispatch logout
      const logoutEvent = (e) => {
        e.preventDefault();
        dispatch(logout());
      };


    return (
        <div className="profile-container">
            <button className='profile-button' onClick={openMenu}>
                <i className="fa-solid fa-user-large fa-lg"/>
            </button>
            {showMenu &&(
                <div className="profile-dropdown">
                    <span id='user-name'>{user.firstName}</span>
                    <span id='user-email'>{user.email}</span>
                    <Link className="my-groups-link" to='/my-groups'>my groups</Link>
                    <button className='logout-button' onClick={logoutEvent}>Log out</button>
                </div>
            )}
        </div>
    );
};
