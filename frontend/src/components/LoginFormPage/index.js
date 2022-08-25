import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/session';
import { Redirect } from  'react-router-dom';


function LoginFormPage() {
    const [credential, setCredential ] = useState(''); //user email
    const [password, setPassword ] = useState('');
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);

    //if current user is logged in, redirect
    if(currentUser) return (<Redirect to='/'/>);

    //handle onSubmit
    const handleSubmit = (e) => {
        e.preventdefault();
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
            <form id='login-form' onSubmit = {handleSubmit}>
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
                <label>Remember Me</label>
                    <input
                        type='checkbox'
                        name='remember'
                    />
            </form>
        </div>

    )

};

export default LoginFormPage;
