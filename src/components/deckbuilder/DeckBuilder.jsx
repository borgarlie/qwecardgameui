import React, { Component } from 'react';
import './DeckBuilder.css';
import ReactPaginate from 'react-paginate';

class DeckBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            all_cards: [],
            decks: []
        };

        this.fetch_cards();
        this.fetch_decks();
    }

    fetch_cards = () => {
        console.log("Fetching cards");
        const options = {
            method: 'GET',
            mode: 'cors',
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.jwt
            }
        };
        fetch('http://localhost:1337/cards', options)
            .then(response => {
                if (!response.ok) {
                    console.log("Error when getting cards");
                    return;
                }
                response.json().then(message => {
                    const cards = message.cards;
                    if (cards) {
                        // Need to match the available card images
                        const max_cards = 10;
                        const sliced_cards = cards.slice(0, max_cards);
                        this.setState({
                            all_cards: sliced_cards
                        });
                        console.log(sliced_cards);
                    }
                });
            });
    };

    fetch_decks = () => {
        console.log("Fetching decks");
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        console.log(selected);
    };

    render() {
        let available_cards = (
            <div className="left_wrapper">
                <div className="left_wrapper_top">
                    <img className="card_image" src="/cards/card1.jpg" />
                    <img className="card_image" src="/cards/card2.jpg" />
                    <img className="card_image" src="/cards/card3.jpg" />
                    <br />
                    <img className="card_image" src="/cards/card4.jpg" />
                    <img className="card_image" src="/cards/card5.jpg" />
                    <img className="card_image" src="/cards/card6.jpg" />
                </div>
                <div className="left_wrapper_bottom">
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={100}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        );

        let decks = (
            <div className="right_wrapper">
                Right side
            </div>
        );

        return (
            <div className="DeckBuilder">
                {available_cards}
                {decks}
            </div>
        );
    }
}

export default DeckBuilder;
