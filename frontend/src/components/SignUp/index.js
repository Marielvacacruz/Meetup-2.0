import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signupUser } from '../../store/session';

function SignupFormPage() {
    //controlled inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName ] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword ] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [validationErrors, setValidationErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => { //listens for all field inputs and validates them
        let errors = []; //mutable array

        //check if name's length is greater than 0
        if(!firstName.length || !lastName.length){
            errors.push('All fields must be completed');
        };

        //check if email has an '@' in it
        if(!email || !email.includes('@')){
            errors.push('Please provide a valid Email')
        };

        //check if passwords match
        if(password !== confirmPassword){
            errors.push('Passwords must match');
        };

        setValidationErrors(errors); //set validationErrors to the errors array
    },[firstName, lastName, email, password, confirmPassword]);



    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user);

    //if current user is logged in, redirect
    if(currentUser) return (<Redirect to='/'/>);

    //handle onSubmit
    const handleSubmit = (e) => {
        e.preventDefault();

        setHasSubmitted(true); //when user  clicks on submit button

        if(validationErrors.length) return alert('Cannot Submit, please check for errors');

        if(!validationErrors.length){
            return dispatch(signupUser({firstName, lastName, email, password}))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setValidationErrors(data.errors);
            });
        }
        //Reset the form state after submitting
    setFirstName('');
    setEmail('');
    setLastName('');
    setPassword('');
    setValidationErrors([]);
    setHasSubmitted(false);
    };

    return (
        <div className='form-container'>
            <h1 className='form-title'>Sign up</h1>
                {hasSubmitted &&  validationErrors.length > 0 &&(
                    <div className='form-errors'>
                        The following errors were found:
                        <ul>
                            {validationErrors.map((error, idx) =>
                            <li key={idx}>{error}</li>)}
                         </ul>
                    </div>
                )}
            <form id='signup-form' onSubmit = {(e) => handleSubmit(e)}>
                <div className='form-inputs'>
                        <label htmlFor='name'>Name</label>
                            <input
                                type="name"
                                name='name'
                                id='name'
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        <label htmlFor='lastName'>Last Name</label>
                            <input
                                type="lastName"
                                name='lastName'
                                id='lastName'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        <label htmlFor='email'>Email</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <label htmlFor='confirm'>Confirm Password</label>
                            <input
                                type='password'
                                name='confirm'
                                id='confirm'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                </div>
                <button className='signup-button' type='submit'>Sign up</button>
            </form>
        </div>

    )

};

export default SignupFormPage;
