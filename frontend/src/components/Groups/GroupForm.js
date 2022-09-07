import  {useState}  from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useHistory, Redirect} from 'react-router-dom';
import {createGroup} from '../../store/groups';

function GroupForm(){
    //form fields
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('In person');
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

    const cancelButton = () => {
        //e.preventDefault(); don't need this because button type is 'button'
        history.push('/my-groups')
    }

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
                        <label htmlFor='name'>Name your group</label>
                            <input
                                type="name"
                                name='name'
                                id='name'
                                placeholder='example: Tennis Club'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        <label htmlFor='about'>Group details</label>
                            <textarea
                                type='about'
                                name='about'
                                id='about'
                                placeholder='Tell us about your group (must be 50 characters or more)'
                                value={about}
                                onChange={(e) => setAbout(e.target.value)}
                                required
                            />
                        <label htmlFor='type'>Will this group meet in person or online?
                            <select
                                type="type"
                                id='type'
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value='In person'>In person</option>
                                <option value='Online'>Online</option>
                            </select>
                        </label>
                        <label htmlFor='city'>Enter city</label>
                            <input
                                type="city"
                                name='city'
                                id='city'
                                placeholder='i.e New Orleans'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                        />
                        <label htmlFor='state'>Enter state</label>
                            <input
                                type="state"
                                name='state'
                                id='state'
                                placeholder='i.e Louisiana or L.A'
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                        />
                </div>
                <button className='create-button' type='submit'>Create Group</button>
                <button className='cancel-button' typ='button' onClick={cancelButton}>cancel</button>
            </form>
        </div>
    );
};

export default GroupForm;
