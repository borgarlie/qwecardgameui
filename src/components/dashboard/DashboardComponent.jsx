import React, { Component } from 'react';
import './DashboardComponent.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class DashboardComponent extends Component {
    render() {
        return (
            <div className="dashboard_component">
                <p>Dashboard</p>

                <Link to="/settings">
                     <Button bsStyle="primary" id="dashboard_link_button">
                        <p>Settings</p>
                     </Button>
                 </Link>

                 <br />
                 <Link to="/">
                     <Button bsStyle="primary" id="dashboard_link_button">
                        <p>Dashboard</p>
                     </Button>
                 </Link>

                <br />
                 <Link to="/">
                     <Button bsStyle="primary" id="dashboard_link_button">
                        <p>Dashboard 2</p>
                     </Button>
                 </Link>
            </div>
        );
    }
}

export default DashboardComponent;
