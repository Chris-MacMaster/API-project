// frontend/src/components/Navigation/index.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';



import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useState } from "react";
import { useHistory } from "react-router-dom"



function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [errors, setErrors] = useState([]);

    const history = useHistory()



    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");



    const demoLogin = (e) => {
        // e.preventDefault();
        // setErrors([]);
        // console.log('triggered')
        return dispatch(sessionActions.login({ credential: "DemoUser",
        password: "jjjjjj"}))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    }


    const demoSignup = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email: "notFake@gmail.com", username: "DemoUser", firstName: "Demo", lastName: "Fremo", password:"jjjjjj" }))
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };



    const becomeDemo = (e) => {
        try {
            demoLogin()
        } catch {
            demoSignup()
            demoLogin()
        }
    }


    const toNewSpot = (e) => {
        history.push("/spots/create")
    }

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <li>
                <button onClick={toNewSpot} className='update-button button' type='button' >Create New Spot</button>
                <ProfileButton user={sessionUser} />
            </li>
        );
    } else {
        sessionLinks = (
            <li>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
                {/* make react component? */}
                {/* <button onClick={becomeDemo} type='button' >
                    Demo Login
                </button> */}
            </li>
        );
    }




    return (
        <ul id='nav-ul'>
            <li className='iconWithCare'>
                <NavLink exact to="/"><i className="fas fa-home" /></NavLink> 
                <p className='careBnB'>
                    CareBnB
                </p>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    );
}

export default Navigation;


//<i class="fa-solid fa-bed-front"></i>