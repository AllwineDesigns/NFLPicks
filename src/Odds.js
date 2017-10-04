import React, { Component } from 'react';
import './Odds.css';

class Odds extends Component {
  setOdds = (i) => (e) => {
    const {
      callbacks
    } = this.props;

    const {
      setOdds
    } = callbacks;

    try {
      const odds = parseInt(e.target.value, 10)/100;
      setOdds(i, odds);
    } catch(e) {
    }
  };

  calculateOdds = (i) => () => {
    const {
      callbacks
    } = this.props;

    const {
      calculateOdds
    } = callbacks;

    calculateOdds(i);
  };

  setOverrideOdds = (i) => (e) => {
    const override_odds = e.target.checked;
    const {
      callbacks
    } = this.props;

    const {
      setOverrideOdds
    } = callbacks;

    setOverrideOdds(i, override_odds);
  };

  render() {
    const {
      games
    } = this.props;

    let rows = games.map((game,i) => {
      const favorite_moneyline = game.favorite_moneyline || -100;
      const underdog_moneyline = game.underdog_moneyline || 100;
      const odds = .5*(-favorite_moneyline/(100-favorite_moneyline)+(1-(100/(100+underdog_moneyline))));

      return (<div className="odds-row" key={game.home + game.away}>
        <div className="odds-column odds-favorite">
          <b>{game.favorite ? game.favorite : "Must choose a favorite between " + game.home + " and " + game.away }</b>
        </div>
        <div className="odds-column">
          <input readOnly={!game.override_odds} value={game.odds ? Math.round(game.odds*100) : Math.round(odds*100)} onChange={this.setOdds(i)}/> %
        </div>
        <div className="odds-column">
          <input type="checkbox" checked={game.override_odds || false} onChange={this.setOverrideOdds(i)}/>
        </div>
      </div>);
    })
    rows.unshift(
      <div className="favorite-row" key="headers">
        <div className="favorite-column favorite-center">
          <b>Favorite</b>
        </div>
      </div>
    );
    return (
      <div className="odds-container">
      {rows}
      </div>
    );
  }
}

export default Odds;
