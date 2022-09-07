import {Link} from 'react-router-dom';
import React from 'react';
import {ReactComponent as PageNotFoundImg} from './page-not-found.svg'

function PageNotFound ()  {
    return (
        <div className="page-not-found">
            <div>
                <PageNotFoundImg/>
                <span>
                    Sorry, the page you requested doesn't exist or was not found.
                </span>
                <Link to='/' className='home-link'>Take me home</Link>
            </div>
        </div>
    );
};

export default PageNotFound;
