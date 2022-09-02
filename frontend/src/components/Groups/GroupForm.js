import  {useState}  from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';
import {createGroup} from '../../store/groups';

function GroupForm(){
    //form fields
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [errors, setErrors] = useState([]);

    const dispatch =  useDispatch();
    const history = useHistory();
    const currentUser = useSelector(state => state.session.user);

    if(!currentUser) return (<Redirect to='/'/>);

     //handle onSubmit
     const handleSubmit = (e) => {
        e.preventDefault();

        setErrors([]);
        const group = {name, about, type, city, state};

        return dispatch(createGroup(group))
            .then(async (res) => {
                if(res.ok)history.push('/my-groups')
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };


    return (
        <div className='form-container'>
            <h1 className='form-title'>Create a new group here</h1>
            <form id='create-group-form' onSubmit = {(e) => handleSubmit(e)}>
                <div className='form-errors'>
                    <ul>
                        {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                    </ul>
                </div>
                <div className='form-inputs'>
                        <label htmlFor='name'>Name your  group</label>
                            <input
                                type="name"
                                name='name'
                                id='name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        <label htmlFor='about'>Tell us about your group</label>
                            <textarea
                                type='about'
                                name='about'
                                id='about'
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                required
                            />
                        <label htmlFor='type'>Will this group meet in person or online?</label>
                            <input
                                type="type"
                                name='type'
                                id='type'
                                placeholder='In person or Online'
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                        />
                        <label htmlFor='city'>Enter city</label>
                            <input
                                type="city"
                                name='city'
                                id='city'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                        />
                        <label htmlFor='state'>Enter state</label>
                            <input
                                type="state"
                                name='state'
                                id='state'
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                        />
                </div>
                <button className='create-button' type='submit'>Create Group</button>
            </form>
        </div>
    );
};

export default GroupForm;
