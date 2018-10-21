import React, { Component } from 'react';
import './App.css';
import GoogleLogin from "react-google-login";
import config from './config.json'

class App extends Component {
    constructor(props) {
        super(props);
        // TODO: Create a user controller to store all the user information and abstract away some of these things?
        // We would anyway require the user information (jwt) to make authenticated api calls from other controllers.
        this.state = {
            isAuthenticated: false,
            user_data: null,
            jwt: ''
        };
    }

    logout = () => {
        this.setState({
            isAuthenticated: false,
            user_data: null,
            jwt: ''
        });
    };

    googleResponse = (response) => {
        const tokenBlob = new Blob(
            [JSON.stringify({id_token: response.tokenId}, null, 2)], {type : 'application/json'});
        const options = {
            method: 'POST',
            body: tokenBlob,
            mode: 'cors',
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
        // Authenticate with backend server
        fetch('http://localhost:1337/api/auth/google', options)
            .then(response => {
                const jwt = response.headers.get('x-auth-token');
                response.json().then(user_data => {
                    console.log(user_data);
                    if (jwt) {
                        this.setState({
                            isAuthenticated: true,
                            user_data: user_data,
                            jwt: jwt
                        });
                    }
                });
            });
    };

    onFailure = (error) => {
        // TODO: Handle error properly
        alert(error);
    };

    render() {
        let content = !!this.state.isAuthenticated ?
            (
                <div>
                    <p>Authenticated</p>
                    <div>
                        {this.state.user_data.email}
                    </div>
                    <div>
                        <button onClick={this.logout} className="button">
                            Log out
                        </button>
                    </div>
                </div>
            ) :
            (
                <div>
                    <GoogleLogin
                        clientId={config.GOOGLE_CLIENT_ID}
                        buttonText="Login"
                        onSuccess={this.googleResponse}
                        onFailure={this.onFailure}
                    />
                </div>
            );

        return (
            <div className="App">
                {content}
            </div>
        );
    }
}

export default App;
