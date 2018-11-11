import React, { Component } from 'react';
import './UserComponent.css';

class UserComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let name_content = (
            <div>
                {this.props.user_data.name}
            </div>
        );

        let emaiL_content = (
            <div>
                {this.props.user_data.email}
            </div>
        );

        let username_content = (
            <div>
                {this.props.user_data.username}
            </div>
        );

        return (
            <div className="UserComponent">
                {name_content}
                {emaiL_content}
                {username_content}
            </div>
        );
    }
}

export default UserComponent;
