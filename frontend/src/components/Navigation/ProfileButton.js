// frontend/src/components/Navigation/ProfileButton.js
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import {useHistory} from "react-router-dom"
import {Link} from "react-router-dom"
import "./Navigation.css"

function ProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory()

    // const user = useSelector(state => state.session.user)

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
        history.push("/")
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");


    // const toCreateSpot = (e) => {
    //     e.preventDefault()
    //     history.push("spots/new")
    // }

    const handleManage = (e) => {
        e.preventDefault()

        history.push("/spots/manage")
    }

    const handleReviewManage = (e) => {
        e.preventDefault()

        history.push("/reviews/manage")
    }

    return (
        <>
            <button className="dropdown-button" onClick={openMenu}>
                <i className="fas fa-user-circle" />
            </button>
            <ul  className={ulClassName} id="dropdown-menu" ref={ulRef}>
                {/* <li>{user.username}</li> */}
                <li id="hello" className="main-dropdown-li">Hello, {user.username}  </li>
                <li id="email" className="main-dropdown-li">{user.email}</li>
                {/* <li>
                    <button onClick={toCreateSpot}>Create New Spot</button>
                </li> */}

                <li className="main-dropdown-li">
                    {/* <Link to="/spots/new">Create New Spot</Link> */}
                </li>

                <li id="manage-spots" className="main-dropdown-li">
                    <p id="manage-text" onClick={handleManage}>
                        Manage Spots
                    </p>
                    {/* <Link to="/spots/current">Manage Spots</Link> */}
                </li>

                <li id="" className="main-dropdown-li manage-reviews">
                    <p id="review-text" onClick={handleReviewManage}>
                        Manage Reviews
                    </p>
                    {/* <Link to="/spots/current">Manage Spots</Link> */}
                </li>

                <li id="logout" className="main-dropdown-li">
                    <button className="modal-button button main-logout" onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    );
}

export default ProfileButton;
