import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { login } from '../../store/session';
import { Redirect, Link} from  'react-router-dom';


function LoginFormPage() {
    const [credential, setCredential ] = useState(''); //user email
    const [password, setPassword ] = useState('');
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);

    //if current user is logged in, redirect
    if(currentUser) return (<Redirect to='/'/>);

    //demo user set up
    const demo_email  = 'demouser1@user.io';
    const demo_password = 'password';

    function demoLogin(){
        setCredential(demo_email);
        setPassword(demo_password);
    };

    //handle onSubmit
    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);

        return dispatch(login({credential, password}))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });

    };

    return (
        <div className='form-container'>
            <h1 className='form-title'>Welcome, Please Log In</h1>
            <span>Not a member yet? <Link id='signup-link' to='/signup'>Sign up</Link></span>
            <form id='login-form' onSubmit = {(e) => handleSubmit(e)}>
                <div className='form-errors'>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                </div>
                <div className='form-inputs'>
                        <label htmlFor='email'>Email</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                value={credential}
                                onChange={(e) => setCredential(e.target.value)}
                                required
                            />
                        <label htmlFor='password'>Password</label>
                            <input
                                type='password'
                                name='password'
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                </div>
                <button className='login-button' type='submit'>Log in</button>
            </form>
                <button className='demo-user' onClick={demoLogin}>Demo User</button>
        </div>

    )

};

export default LoginFormPage;
