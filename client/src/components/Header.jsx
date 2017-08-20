import React, {PropTypes} from 'react';
import { Link, IndexLink } from 'react-router';


const Header = (
    home
) => home ? 
    (<div className="header">
        <div className="header">
            What Floats Your Vote
        </div>

        <div className="header-right">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
        </div>
    </div>)
    :
    (<div className="header">
        <Link to="/">
            <div id="topic-header-home-button">
                Home
            </div>
        </Link>
        What Floats Your Vote

        <div className="header-right">
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
        </div>
    </div>)

Header.propTypes = {
    home: PropTypes.bool.isRequired
};

export default Header;