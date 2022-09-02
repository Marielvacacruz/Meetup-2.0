import {Link} from 'react-router-dom';

function PageNotFound ()  {
    return (
        <div className="page-not-found">
            <div>
                <h1>404</h1>
                <span>
                    Sorry, the page you requested doesn't exist or was not found.
                </span>
                <Link to='/' className='home-link'>Take me home</Link>
            </div>
        </div>
    );
};

export default PageNotFound;
