import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PicksRow from './PicksRow';
import { Button } from 'react-bootstrap';

import './Picks.css';

class Picks extends Component {
  render() {
    const {
      games,
      callbacks
    } = this.props;
    return (<div className="picks-container">
      <div className="picks-row" key="headers">
        <div className="picks-column picks-center">
          <b>Rank</b>
        </div>
        <div className="picks-column picks-center">
          <b>Favorite</b>
        </div>
        <div className="picks-column picks-center">
          <b>Home</b>
        </div>
        <div className="picks-column picks-center">
          <b>Away</b>
        </div>
        <div className="picks-column picks-center">
          <Button bsSize="xsmall" bsStyle="default" onClick={() => callbacks.sortByOdds()}>Odds</Button>
        </div>
      </div>
     { games.map((game, i) => <PicksRow callbacks={callbacks} games={games} game={game} index={i} id={game.home + game.away} key={game.home + game.away} text={game.favorite} moveCard={ (dragIndex, hoverIndex) => { callbacks.swapGames(dragIndex, hoverIndex) } }/>) }
    </div>);
  }
}

export default DragDropContext(HTML5Backend)(Picks);
