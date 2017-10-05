import React, { Component } from 'react';
import data from './data.json';
import { Nav, NavItem } from 'react-bootstrap';
import Favorite from './Favorite';
import Moneylines from './Moneylines';
import Odds from './Odds';
import Picks from './Picks';
import update from 'immutability-helper';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    // TODO - fetch data over network
    let keys = Object.keys(data).sort();
    let key = keys[keys.length-1];

    let games = data[key];
    this.state = { tab: 'picks', games: games };

    this.tabs = {
      favorite: Favorite,
      moneylines: Moneylines,
      odds: Odds,
      picks: Picks,
    };

    this.callbacks = {
      swapGames: (dragIndex, hoverIndex) => {
        this.setState((prevState, props) => {
          const { games } = this.state;
          const dragGame = games[dragIndex];
          return update(prevState, { games: { $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGame]
          ]}});
        });
      },
      setFavorite: (i, team) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { favorite: { $set: team } } });

          return { games: newGames };
        });
      },
      setFavoriteMoneyline: (i, moneyline) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { favorite_moneyline: { $set: moneyline } } });

          return { games: newGames };
        });
      },
      setUnderdogMoneyline: (i, moneyline) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { underdog_moneyline: { $set: moneyline } } });

          return { games: newGames };
        });
      },
      setOdds: (i, odds) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { odds: { $set: odds } } });

          return { games: newGames };
        });
      },
      calculateOdds: (i) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const favorite_moneyline = games[i].favorite_moneyline || -100;
          const underdog_moneyline = games[i].underdog_moneyline || 100;
          const odds = .5*(-favorite_moneyline/(100-favorite_moneyline)+(1-(100/(100+underdog_moneyline))));

          const newGames = update([ ...games ], { [i]: { odds: { $set: odds } } });

          return { games: newGames };
        });
      },
      setOverrideOdds: (i, override_odds) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { override_odds: { $set: override_odds } } });

          return { games: newGames };
        });
      },
      setPick: (i, team) => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          const newGames = update([ ...games ], { [i]: { pick: { $set: team } } });

          return { games: newGames };
        });
      },
      sortByOdds: () => {
        this.setState((prevState, props) => {
          const {
            games
          } = prevState;

          let newGames = [ ...games ];

          newGames.sort((a,b) => {
            let a_odds = a.override_odds ? a.odds : .5*(-a.favorite_moneyline/(100-a.favorite_moneyline)+(1-(100/(100+a.underdog_moneyline))));
            a_odds = (a.favorite === a.pick || !a.pick) ? a_odds : 1-a_odds;

            let b_odds = b.override_odds ? b.odds : .5*(-b.favorite_moneyline/(100-b.favorite_moneyline)+(1-(100/(100+b.underdog_moneyline))));
            b_odds = (b.favorite === b.pick || !b.pick) ? b_odds : 1-b_odds;

            return a_odds-b_odds;
          });

          console.log(newGames);

          return { games: newGames };
        });
      }
    };
  }

  handleSelect = (select) => {
    this.setState({ tab: select });
  };

  render() {
    const {
      tab,
      games
    } = this.state;

    const Tab = this.tabs[tab];
    
    return (
      <div className="App">
        <Nav bsStyle="tabs" activeKey={tab} onSelect={this.handleSelect}>
          <NavItem eventKey="favorite">Favorite</NavItem>
          <NavItem eventKey="moneylines">Moneylines</NavItem>
          <NavItem eventKey="odds">Odds</NavItem>
          <NavItem eventKey="picks">Picks</NavItem>
        </Nav>
        <Tab games={games} callbacks={this.callbacks}/>
      </div>
    );
  }
}

export default App;
