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
            total_cards_in_current_deck: -1,
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
        if (!this.state.deck_building_mode) {
            return;
        }
        let deck_copy = this.state.current_deck_cards;
        let found = false;
        for (var i = 0; i < deck_copy.length; i++) {
            if (deck_copy[i].card_id === card.card_id) {
                // TODO: Remember to set amount variable when fetching deck from db as well
                if (deck_copy[i].amount === 4) {
                    return;
                }
                deck_copy[i].amount += 1
                found = true;
                break;
            }
        }
        if (!found) {
            let card_copy = JSON.parse(JSON.stringify(card));
            card_copy.amount = 1;
            deck_copy.push(card_copy);
        }
        let new_total_cards = this.state.total_cards_in_current_deck + 1;
        this.setState({
            current_deck_cards: deck_copy,
            total_cards_in_current_deck: new_total_cards
        });
    };

    getTotalCards = (deck) => {
        // TODO: Call this when initialising list of cards when clicking on a deck
        let amount = 0;
        for (var i = 0; i < deck.length; i++) {
            amount += deck[i].amount;
        }
        return amount;
    };

    createTempDeck = () => {
        this.setState({
            current_deck_cards: [],
            current_deck_name: "temp name (click to change)",
            current_deck_id: -1,
            total_cards_in_current_deck: 0,
            deck_is_temp: true,
            deck_building_mode: true
        });
    };

    handleGoBackButton = () => {
        this.setState({
            current_deck_cards: [],
            current_deck_name: null,
            current_deck_id: -1,
            deck_is_temp: false,
            deck_building_mode: false
        });
    };

    removeCard = (card) => {
        let deck_copy = this.state.current_deck_cards;
        for (var i = 0; i < deck_copy.length; i++) {
            if (deck_copy[i].card_id === card.card_id) {
                if (deck_copy[i].amount === 1) {
                    deck_copy.splice(i, 1);
                } else {
                    deck_copy[i].amount -= 1;
                }
                break;
            }
        }
        let new_total_cards = this.state.total_cards_in_current_deck - 1;
        this.setState({
            current_deck_cards: deck_copy,
            total_cards_in_current_deck: new_total_cards
        });
    };

    saveDeck = () => {
        console.log("Saving deck");

        // re-fetch decks after saving
        this.fetch_decks();
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
            return <img className="card_image" alt={card.name} key={index} src={image} onClick={() => this.handleChooseCard(card)} />
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

        // TODO: Make the list scrollable

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

        let cards_in_current_deck = this.state.current_deck_cards.map((card, index) => {
            // return <img className="card_image" key={index} src={image} onClick={() => this.handleChooseCard(card)} />
            // TODO: Show card image on hover!
            let image = "/cards/" + card.image_file;
            return (
                <Button bsStyle="default" className="card" key={index} onClick={() => this.removeCard(card)}>
                    <div className="card_name">
                        {card.name}
                    </div>
                    <div className="card_amount">
                        {card.amount}
                    </div>
                    <span className="card_image_hover">
                        <img className="card_image" src={image} alt={card.name} />
                    </span>
                </Button>
            );
        });

        if (this.state.current_deck_cards.length === 0) {
            cards_in_current_deck = (
                <div className="no_card">
                    There are no cards in this deck.
                    <br />
                    <br />
                    Click on a card to add it.
                </div>
            );
        }

        let save_deck_button = (this.state.total_cards_in_current_deck === 40) ?
            (
                <Button bsStyle="success" className="card_button_save" onClick={this.saveDeck}>
                    <div className="card_button_name">
                        Save Deck ({this.state.total_cards_in_current_deck} cards)
                    </div>
                </Button>
            ) : (
                <Button bsStyle="danger" className="card_button_save" onClick={this.saveDeck}>
                    <div className="card_button_name">
                        Save Deck ({this.state.total_cards_in_current_deck} cards)
                    </div>
                </Button>
            );

        // TODO: Make this use actual chosen cards.
        // TODO: Make list scrollable
        // TODO: Extract to sub-component?
        let current_deck = (
            <div className="decks">
                <Button bsStyle="primary" className="card_button" onClick={this.handleGoBackButton}>
                    <div className="card_button_name">
                        Back
                    </div>
                </Button>
                <div className="current_deck_name">
                    <input className="current_deck_name_input" type="text" value={this.state.current_deck_name} onChange={(e) => {this.setState({current_deck_name: e.target.value})}} />
                </div>
                <div className="cards">
                    {cards_in_current_deck}
                </div>
                {save_deck_button}
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
