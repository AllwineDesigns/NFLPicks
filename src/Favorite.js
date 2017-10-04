import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import './Favorite.css';

class Favorite extends Component {
  setFavorite = (i,favorite) => () => {
    const {
      callbacks
    } = this.props;

    const {
      setFavorite
    } = callbacks;

    setFavorite(i,favorite);
  };

  render() {
    const {
      games
    } = this.props;

    let rows = games.map((game,i) => (
      <div className="favorite-row" key={game.home + game.away}>
        <div className="favorite-column">
          <Button bsSize="xsmall" bsStyle={game.favorite === game.home ? "primary" : "default"} onClick={this.setFavorite(i, game.home)}>{game.home}</Button>
        </div>
        <div className="favorite-column">
          <Button bsSize="xsmall" bsStyle={game.favorite === game.away ? "primary" : "default"} onClick={this.setFavorite(i, game.away)}>{game.away}</Button>
        </div>
      </div>
    ))

    rows.unshift(
      <div className="favorite-row" key="headers">
        <div className="favorite-column favorite-center">
          <b>Home</b>
        </div>
        <div className="favorite-column favorite-center">
          <b>Away</b>
        </div>
      </div>
    );
    return (
      <div className="favorite-container">
      {rows}
      </div>
    );
  }
}

export default Favorite;
