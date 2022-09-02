import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {editGroup} from  '../../store/groups';

function EditGroup(){
    let {groupId} = useParams();
    const group = useSelector((state) => state.groupState[`${groupId}`]);

    //set state for form fields based on current group
    const [name, setName] = useState(group.name);
    const [about, setAbout] = useState(group.about);
    const [type, setType] = useState(group.type);
    const [city, setCity] = useState(group.city);
    const [state, setState] = useState(group.state);
    const [errors, setErrors] = useState([]);

    const dispatch = useDispatch();
    const history = useHistory();

    //handle onSubmit
    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors([]);
        const group = {name, about, type, city, state};

        return dispatch(editGroup(group, groupId))
            .then(async (res) => {
                if(res.ok)history.push('/my-groups')
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    return(
        <div className='form-container'>
            <h1 className='form-title'>Editing {name}</h1>
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
                <button className='submit-button' type='submit'>submit edits</button>
            </form>
        </div>
    );
};

export default EditGroup;
