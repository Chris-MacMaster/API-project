// frontend/src/components/SignupFormModal/index.js
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const [objErrors, setObjErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(() => {
        let eObj = {}
        setObjErrors(eObj)
        
        if (!email) eObj.email = "Please enter an email"
        if (!email.includes("@")) eObj.validEmail = "Please enter a valid email, must contain an @"
        if (!username) eObj.username = "Please enter a username"
        if (username.length < 4) eObj.userNameLength = "Username must be at least 4 characters"
        if (!firstName) eObj.firstName = "Please enter a first name"
        if (!lastName) eObj.lastName = "Please enter a last name"
        if (!password) eObj.password = "Please enter a password"
        if (password !== confirmPassword) eObj.matchPassword = "Confirm Password field must be the same as the Password field"
        if (password.length < 6) eObj.passwordLength = "Password must be at least 6 characters or more"
    
        // console.log("EOBJ", eObj)
        
    }, [email, username, firstName, lastName, password, confirmPassword])

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true)

        if (Object.values(objErrors).length) return

        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
                .then(closeModal)
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors(['Confirm Password field must be the same as the Password field']);
    };



    return (
        <>
            <div className="signup-div">
                <h1 className="sign-up">Sign Up</h1>
                {hasSubmitted && objErrors.email && (
                    <div className='error'>
                        * {objErrors.email}
                    </div>
                )}
                {hasSubmitted && objErrors.validEmail && (
                    <div className='error'>
                        * {objErrors.validEmail}
                    </div>
                )}
                {hasSubmitted && objErrors.username && (
                    <div className='error'>
                        * {objErrors.username}
                    </div>
                )}
                {hasSubmitted && objErrors.userNameLength && (
                    <div className='error'>
                        * {objErrors.userNameLength}
                    </div>
                )}
                {hasSubmitted && objErrors.firstName && (
                    <div className='error'>
                        * {objErrors.firstName}
                    </div>
                )}
                {hasSubmitted && objErrors.lastName && (
                    <div className='error'>
                        * {objErrors.lastName}
                    </div>
                )}
                {hasSubmitted && objErrors.password && (
                    <div className='error'>
                        * {objErrors.password}
                    </div>
                )}
                {hasSubmitted && objErrors.matchPassword && (
                    <div className='error'>
                        * {objErrors.matchPassword}
                    </div>
                )}
                {hasSubmitted && objErrors.passwordLength && (
                    <div className='error'>
                        * {objErrors.passwordLength}
                    </div>
                )}
                <form id="signup-form" onSubmit={handleSubmit}>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                    
                    <label className="signup-input">
                        {/* Email */}
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            // required
                            placeholder="Email"
                            className="signup-input"
                        />
                    </label>
          
                    <label className="signup-input">
                        {/* Username */}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            // required
                            placeholder="Username"
                            className="signup-input"
                        />
                    </label>
       
                    <label className="signup-input">
                        {/* First Name */}
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            // required
                            placeholder="First Name"
                            className="signup-input"
                        />
                    </label>
                 
                    <label className="signup-input">
                        {/* Last Name */}
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            // required
                            placeholder="Last Name"
                            className="signup-input"
                        />
                    </label>
           
                    <label className="signup-input">
                        {/* Password */}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            // required
                            placeholder="Password"
                            className="signup-input"
                        />
                    </label>
                    <label className="signup-input">
                        {/* Confirm Password */}
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            // required
                            placeholder="Confirm Password"
                            className="signup-input"
                        />
                    </label>

                    <button className="modal-button button white-button signup-button signup-input" type="submit">Sign Up</button>
                </form>

            </div>
        </>
    );
}

export default SignupFormModal;