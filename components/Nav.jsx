import React from 'react';
import ReactDOM from 'react-dom';

import {Link} from 'react-router';


class Nav extends React.Component {

    constructor(props) {
        super(props);
        console.log('constructing nav');

        this.state = {
            path: this.props.path,
            humanPath: this.props.humanPath
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.path === nextProps.path || this.state.humanPath === nextProps.humanPath) {
            return;
        }
        this.setState({
            path: nextProps.path,
            humanPath: nextProps.humanPath
        });
    }

    render() {

        let navList = this.state.humanPath.map(
            (p, i) =>
                <div className="nav-link-container" key={i}>
                    <Link to={"/whatfloatsyourvote/"+(this.state.path.slice(0, i+1).join('/'))} className="nav-link">
                        {p}
                    </Link>
                    <div className="nav-link-separator">
                        >
                    </div>
                </div>
        );  
        return (
            <div>
               {navList}
            </div>
        )
    }
}

export default Nav;