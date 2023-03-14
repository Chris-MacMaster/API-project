// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const [confirmPassword, setConfirmPassword] = useState("");


    const demoLogin = (e) => {
        // e.preventDefault();
        // setErrors([]);
        // console.log('triggered')
        return dispatch(sessionActions.login({
            credential: "DemoUser",
            password: "jjjjjj"
        }))
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
            return dispatch(sessionActions.signup({ email: "notFake@gmail.com", username: "DemoUser", firstName: "Demo", lastName: "Fremo", password: "jjjjjj" }))
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


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        
        console.log(credential)
        console.log(password)

        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <>
            <div className="login-modal-div">
                <form className="login-form" onSubmit={handleSubmit}>
                    <p className="login-p">
                        Log In
                    </p>
                    <ul>
                        {errors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                    <label className="login-input">
                        {/* Username or Email */}
                        <input
                            type="text"
                            value={credential}
                            placeholder="Username or Email"
                            onChange={(e) => setCredential(e.target.value)}
                            required
                            className="login-input"
                        />
                    </label>
                    <label className="login-input">
                        {/* Password */}
                        <input
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                        />
                    </label>
                    <button className="modal-button button modal-login-button white-button" type="submit">Log In</button>
                    <button onClick={becomeDemo} id="demo-button" className="modal-button button modal-login-button modal-login-demo-button" type="button">Demo User</button>
                </form>

            </div>
        </>
    );
}

export default LoginFormModal;