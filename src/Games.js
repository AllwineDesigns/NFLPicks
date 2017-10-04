import React, { Component } from 'react';

class Games extends Component {
  render() {
    const {
      games
    } = this.props;

    const gameElements = games.map((game) => (
      <div key={ game.home + "v" + game.away}>At {game.home} VS {game.away}</div>
    ));
    return (<div>
    {gameElements}
    </div>);
  }
}

export default Games;
