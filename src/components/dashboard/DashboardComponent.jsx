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
                 <Link to="/deck">
                     <Button bsStyle="primary" id="dashboard_link_button">
                        <p>Deck Builder</p>
                     </Button>
                 </Link>

                <br />
                 <Link to="/game/menu">
                     <Button bsStyle="primary" id="dashboard_link_button">
                        <p>Game Menu</p>
                     </Button>
                 </Link>
            </div>
        );
    }
}

export default DashboardComponent;
