import React, { Component } from 'react';
import './DeckBuilder.css';
import ReactPaginate from 'react-paginate';
import { Button } from 'react-bootstrap';

class DeckBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            all_cards: [],
            decks: [],
            current_deck_cards: [], // This should also have an amount variable for each card
            current_deck_name: null,
            current_deck_id: -1,
            deck_is_temp: null,
            deck_building_mode: false,
            current_page: 0
        };

        this.fetch_cards();
        this.fetch_decks();
    }

    fetch_cards = () => {
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
                        this.setState({
                            all_cards: cards
                        });
                    }
                });
            });
    };

    fetch_decks = () => {
        // TODO: Implement this
        console.log("Fetching decks");
    };

    handlePageClick = (data) => {
        let selected = data.selected;
        this.setState({
            current_page: selected
        });
    };

    handleChooseCard = (card) => {
        console.log("Clicked on card");
        console.log(card);
    };

    getTotalCards = (deck) => {
        return 14;
    };

    createTempDeck = () => {
        this.setState({
            current_deck_cards: [],
            current_deck_name: "temp name (click to change)",
            current_deck_id: -1,
            deck_is_temp: true,
            deck_building_mode: true
        });
    };

    saveDeck = () => {
        // TODO: How to update "decks" with an additional deck?
        console.log("Saving deck");
    };

    render() {
        let total_cards = this.state.all_cards.length;
        // TODO: Should set this based on screen-size. 6 should be minimum, but could also increase to 8 or more.
        // TODO: Should also set a maximum screen size to support.
        let cards_per_page = 6;
        let num_pages = Math.ceil(total_cards/cards_per_page);

        let start = this.state.current_page * cards_per_page;
        let end = start + cards_per_page;
        if (end > total_cards) {
            end = total_cards;
        }

        let cards_in_page = this.state.all_cards.slice(start, end);
        let cards_to_show = cards_in_page.map((card, index) => {
            let image = "/cards/" + card.image_file;
            return <img className="card_image" key={index} src={image} onClick={() => this.handleChooseCard(card)} />
        });

        let available_cards = (
            <div className="left_wrapper">
                <div className="left_wrapper_top">
                    {cards_to_show}
                </div>
                <div className="left_wrapper_bottom">
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={num_pages}
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

        // TODO: Generate decks based on "decks"

        // TODO: Extract to sub-component?
        let decks = (
            <div className="decks">
                <div className="deck">
                    <Button bsStyle="primary" className="new_deck_button" onClick={this.createTempDeck}>
                        <div className="new_deck_name">
                            Create New Deck
                        </div>
                    </Button>
                </div>
                <div className="deck">
                    <Button bsStyle="success" className="deck_button">
                        <div className="deck_name">
                            Some deck name
                        </div>
                        <div className="deck_status ready">
                            Ready
                        </div>
                    </Button>
                </div>
                <div className="deck">
                    <Button bsStyle="success" className="deck_button">
                        <div className="deck_name">
                            Some deck name 2
                        </div>
                        <div className="deck_status ready">
                            Ready
                        </div>
                    </Button>
                </div>
                <div className="deck">
                    <Button bsStyle="info" className="deck_button">
                        <div className="deck_name">
                            Some deck name 3
                        </div>
                        <div className="deck_status not_ready">
                            Not Ready (23 cards)
                        </div>
                    </Button>
                </div>
            </div>
        );

        // TODO: Extract to sub-component?
        let current_deck = (
            <div>
                current deck
            </div>
        );

        let decks_wrapper = !this.state.deck_building_mode ? 
            (
                <div className="right_wrapper">
                    {decks}
                </div>
            ) : (
                <div className="right_wrapper">
                    {current_deck}
                </div>
            );

        return (
            <div className="DeckBuilder">
                {available_cards}
                {decks_wrapper}
            </div>
        );
    }
}

export default DeckBuilder;
