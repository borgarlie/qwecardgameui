import React, { Component } from 'react';
import './App.css';
import GoogleLogin from "react-google-login";
import config from './config.json'
import UserComponent from './components/user/UserComponent'
import Cookies from 'universal-cookie';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            user_data: null,
            jwt: ''
        };

        this.cookies = new Cookies();
        this.getUserDataFromCookie();
    }

    getUserDataFromCookie = () => {
        const user = this.cookies.get('user');
        console.log(user);
        const jwt = this.cookies.get('jwt');
        console.log(jwt);
        if (user && jwt) {
            this.verifyJwt(user, jwt);
        }
    };

    verifyJwt = (user, jwt) => {
        const options = {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + jwt
            }
        };
        fetch('http://localhost:1337/auth/verify', options)
            .then(response => {
                if (!response.ok) {
                    console.log("Error when verifying jwt");
                    this.cookies.remove('user');
                    this.cookies.remove('jwt');
                    return;
                }
                response.json().then(message => {
                    console.log("Message from verify jwt: " + message);
                    if (message === "ok") {
                        this.setState({
                            isAuthenticated: true,
                            user_data: user,
                            jwt: jwt
                        });
                    }
                });
            });
    };

    logout = () => {
        this.setState({
            isAuthenticated: false,
            user_data: null,
            jwt: ''
        });
        this.cookies.remove('user');
        this.cookies.remove('jwt');
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
        fetch('http://localhost:1337/auth/google', options)
            .then(response => {
                response.json().then(user_data => {
                    console.log(user_data);
                    const jwt = user_data.jwt;
                    console.log(jwt);
                    const user = user_data.user;
                    console.log(user);
                    if (jwt && user) {
                        this.setState({
                            isAuthenticated: true,
                            user_data: user,
                            jwt: jwt
                        });
                        this.cookies.set('user', user);
                        this.cookies.set('jwt', jwt);
                    } else {
                        const error = user_data.error;
                        if (error) {
                            // TODO: Handle error. Show some info to user.
                            console.log(error);
                        } 
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
                    <UserComponent user_data={this.state.user_data} />
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
