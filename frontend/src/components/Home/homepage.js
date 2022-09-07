import { Link } from "react-router-dom";
import React from  'react';
import {ReactComponent as GroupLogo} from  './man-holding-binoculars-finding-something.svg'
import {ReactComponent as EventLogo} from './woman-watching-paintings-at-an-art-museum.svg'
function HomePage() {
    return(
        <div className="homepage-links">
            <div className="group-container">
                <GroupLogo/>
                <div className="group-text">
                    <Link className="group-link" to='/groups'>
                        <h3>Explore some groups</h3>
                    </Link>
                    <p className="text-sm">Check out some of the groups in the Meetup Community</p>
                </div>

            </div>
            <div className="event-container">
                    <EventLogo/>
                <div className="event-text">
                    <Link className="event-link" to='/events'>
                        <h3>Find an event</h3>
                    </Link>
                    <p className="text-sm">Attend an event near you, make some friends, have fun</p>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
