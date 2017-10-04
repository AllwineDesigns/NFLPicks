import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './Picks.css';

class Picks extends Component {
  setPick = (i,pick) => () => {
    const {
      callbacks
    } = this.props;

    const {
      setPick
    } = callbacks;

    setPick(i,pick);
  };

  render() {
    const {
      games
    } = this.props;

    const byes = [ 8, 9, 7, 10, 6 ].slice(0, 16-games.length);
    const minBye = Math.min.apply(null, byes);
    const maxBye = Math.max.apply(null, byes);
    console.log(minBye, maxBye);
    const show_favorites = games.map((game) => game.favorite).reduce((a,b) => a || b);
    const show_odds = true;

    let rows = games.map((game,i) => {
      const favorite_moneyline = game.favorite_moneyline || -100;
      const underdog_moneyline = game.underdog_moneyline || 100;
      let odds = game.override_odds ? game.odds : .5*(-favorite_moneyline/(100-favorite_moneyline)+(1-(100/(100+underdog_moneyline))));
      odds = (game.favorite === game.pick || !game.pick ? odds : 1-odds);

      return (<div className="picks-row" key={game.home + game.away}>
        <div className="picks-column picks-center">
        {i+1 >= minBye ? maxBye+1+(i+1-minBye) : i+1}
        </div>
      { show_favorites ? 
          <div className="picks-column picks-center">
          <b>{game.favorite}</b>
          </div>
        : null }
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle={game.pick === game.home ? "primary" : "default"} onClick={this.setPick(i, game.home)}>{game.home}</Button>
        </div>
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle={game.pick === game.away ? "primary" : "default"} onClick={this.setPick(i, game.away)}>{game.away}</Button>
        </div>
      { show_odds ? 
          <div className="picks-column picks-center">
          <b>{ game.pick ? Math.round(odds*100) + "%" : ""}</b>
          </div>
        : null }
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle="default" onClick={this.setPick(i, Math.random() < .5 ? game.home : game.away)}>Coin Flip</Button>
        </div>
        <div className="picks-column picks-randomize">
          <Button bsSize="xsmall" bsStyle="default" onClick={this.setPick(i, Math.random() < odds ? game.favorite : (game.home === game.favorite ? game.away : game.home))}>Randomize Based On Odds</Button>
        </div>
      </div>);
    })

    rows.unshift(
      <div className="picks-row" key="headers">
        <div className="picks-column picks-center">
          <b>Rank</b>
        </div>
        { show_favorites ? 
        <div className="picks-column picks-center">
          <b>Favorite</b>
        </div>
        : null }
        <div className="picks-column picks-center">
          <b>Home</b>
        </div>
        <div className="picks-column picks-center">
          <b>Away</b>
        </div>
        { show_odds ? 
        <div className="picks-column picks-center">
          <b>Odds</b>
        </div>
        : null }
        <div className="picks-column picks-center">
          <b>&nbsp;</b>
        </div>
        <div className="picks-column picks-center">
          <b>&nbsp;</b>
        </div>
      </div>
    );
    return (
      <div className="picks-container">
      {rows}
      </div>
    );
  }
}

export default Picks;
