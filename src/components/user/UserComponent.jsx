import React, { Component } from 'react';
import './UserComponent.css';
import { Button } from 'react-bootstrap';

class UserComponent extends Component {
    constructor(props) {
        // TODO: Use PropTypes ? Or Flow?
        super(props);

        this.state = {
            new_username: '',
            error_message_when_changing_username: null
        };
    }

    updateUsername = () => {
        // TODO: Should refactor some of this. E.g. make utility functions for options with inserting method and body
        // Both with and without authorization
        const new_username = this.state.new_username;
        const jwt = this.props.jwt;
        const usernameBlob = new Blob(
            [JSON.stringify({username: new_username}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'PUT',
            body: usernameBlob,
            mode: 'cors',
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }
        };
        fetch('http://localhost:1337/user/username', options)
            .then(response => {
                if (!response.ok) {
                    console.log("Error when changing username");
                    this.setState({
                        error_message_when_changing_username: "Username must be unique and include a minimum of 5 characters."
                    }, () => {
                        window.setTimeout(this.resetUsernameError, 5000);
                    });
                    return;
                }
                response.json().then(updateSuccessful => {
                    console.log("Message when changing username: " + updateSuccessful);
                    if (updateSuccessful) {
                        this.props.update_username_handler(new_username);
                        this.resetUsernameError();
                    } else {
                        this.setState({
                            error_message_when_changing_username: "Username must be unique and include a minimum of 5 characters."
                        }, () => {
                            window.setTimeout(this.resetUsernameError, 5000);
                        });
                    }
                });
            });
    };

    resetUsernameError = () => {
        this.setState({
            error_message_when_changing_username: null
        });
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

        let error_message_username = !!this.state.error_message_when_changing_username ? (
                <div>
                    Error: {this.state.error_message_when_changing_username}
                </div>
            ) : (
                <div>
                    &nbsp;
                </div>
            );

        let username_content = (
            <div>
                Username: {this.props.user_data.username}
                <br />
                Update username:
                <br />
                <input type="text" value={this.state.new_username} onChange={(e) => {this.setState({new_username: e.target.value})}} />
                <Button bsStyle="primary" onClick={this.updateUsername}>Update</Button>
                {error_message_username}
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
