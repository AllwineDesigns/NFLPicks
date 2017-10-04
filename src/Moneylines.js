import React, { Component } from 'react';
import './Moneylines.css';

class Moneylines extends Component {
  setFavoriteMoneyline = (i) => (e) => {
    const {
      callbacks,
      games
    } = this.props;

    const {
      setFavoriteMoneyline,
      calculateOdds
    } = callbacks;

    try {
      const favorite_moneyline = parseInt(e.target.value, 10) || undefined;
      setFavoriteMoneyline(i, favorite_moneyline);

      if(!games[i].override_odds) {
        calculateOdds(i);
      }
    } catch(e) {
    }
  };
  setUnderdogMoneyline = (i) => (e) => {
    const {
      callbacks,
      games
    } = this.props;

    const {
      setUnderdogMoneyline,
      calculateOdds
    } = callbacks;

    try {
      const underdog_moneyline = parseInt(e.target.value, 10) || undefined;
      setUnderdogMoneyline(i, underdog_moneyline);

      if(!games[i].override_odds) {
        calculateOdds(i);
      }
    } catch(e) {
    }
  };

  render() {
    const {
      games
    } = this.props;

    let rows = games.map((game,i) => (
      <div className="moneylines-row" key={game.home + game.away}>
        <div className="moneylines-column moneylines-favorite">
          <b>{game.favorite ? game.favorite : "Must choose a favorite between " + game.home + " and " + game.away }</b>
        </div>
        <div className="moneylines-column">
          -<input value={Math.abs(game.favorite_moneyline) || '100'} onChange={this.setFavoriteMoneyline(i)}/>
        </div>
        <div className="moneylines-column">
          +<input value={game.underdog_moneyline || '100'} onChange={this.setUnderdogMoneyline(i)}/>
        </div>
      </div>
    ))
    rows.unshift(
      <div className="favorite-row" key="headers">
        <div className="favorite-column favorite-center">
          <b>Favorite</b>
        </div>
      </div>
    );
    return (
      <div className="moneylines-container">
      {rows}
      </div>
    );
  }
}

export default Moneylines;
