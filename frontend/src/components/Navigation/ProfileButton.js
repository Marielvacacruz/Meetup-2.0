import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { Link} from "react-router-dom";


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
        dispatch(logout())
      };


    return (
        <div className="profile-container">
            <button className='profile-button' onClick={openMenu}>
              <i className="fa-solid fa-bars"></i>
            </button>
            {showMenu &&(
                <div className="profile-dropdown">
                    <span id='user-name'>Welcome, {user.firstName}</span>
                    <Link to='/' className="home-button">Home</Link>
                    <div  className="my-groups-nav">
                      <Link className="my-groups-link" to='/my-groups'>
                      <img src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
                      alt="group of people"
                      className="my-groups-image"
                      />
                        my groups
                        </Link>
                      <Link className="start-group-link" to='/group-form'>start a new group</Link>
                    </div>
                    <button className='logout-button' onClick={logoutEvent}>Log out</button>
                </div>
            )}
        </div>
    );
};
