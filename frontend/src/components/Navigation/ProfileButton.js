import React, { useState, useEffect} from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";

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
        <div>
            <button onClick={openMenu}>
                <i className="fa-solid fa-user"/>
            </button>
            {showMenu &&(
                <ul className="profile-dropdown">
                    <li>{user.firstName}</li>
                    <li>{user.email}</li>
                    <li>
                        <button onClick={{logoutEvent}}>Log out</button>
                    </li>
                </ul>
            )};
        </div>
    );
};
