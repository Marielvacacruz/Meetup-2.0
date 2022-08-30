import { Link } from "react-router-dom";

function HomePage() {
    return(
        <div className="homepage-links">
            <div className="group-container">
                <div className="group-icon">
                    <img src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"  alt="two hands"></img>
                </div>
                <div className="group-text">
                    <Link className="group-link" to='/groups'>
                        <h3>Explore some groups!</h3>
                    </Link>
                    <p className="text-sm">Check out some of the groups in the Meetup Community</p>
                </div>

            </div>
            <div className="event-container">
                <div className="event-icon">
                    <img src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384' alt='event ticket'/>
                </div>
                <div className="event-text">
                    <Link className="event-link" to='/events'>
                        <h3>Find an event</h3>
                    </Link>
                    <p className="text-sm">Attend an event near you, make some friends, have fun!</p>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
