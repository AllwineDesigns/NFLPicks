import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';

const ItemType = 'PickRow';

const style = {
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
  };

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
      games, 
      game, 
      isDragging, 
      connectDragSource, 
      connectDropTarget,
      index,
      callbacks
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    const byes = [ 8, 9, 7, 10, 6 ].slice(0, 16-games.length);
    const minBye = Math.min.apply(null, byes);
    const maxBye = Math.max.apply(null, byes);

    const favorite_moneyline = game.favorite_moneyline || -100;
    const underdog_moneyline = game.underdog_moneyline || 100;
    let odds = game.override_odds ? game.odds : .5*(-favorite_moneyline/(100-favorite_moneyline)+(1-(100/(100+underdog_moneyline))));
    odds = (game.favorite === game.pick || !game.pick ? odds : 1-odds);

    return connectDragSource(connectDropTarget(
      <div className="picks-row" key={game.home + game.away} style={ { ...style, opacity }}>
        <div className="picks-column picks-center">
        {index+1 >= minBye ? maxBye+1+(index+1-minBye) : index+1}
        </div>
        <div className="picks-column picks-center">
        <b>{game.favorite}</b>
        </div>
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle={game.pick === game.home ? "primary" : "default"} onClick={this.setPick(index, game.home)}>{game.home}</Button>
        </div>
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle={game.pick === game.away ? "primary" : "default"} onClick={this.setPick(index, game.away)}>{game.away}</Button>
        </div>
        <div className={classnames("picks-column", "picks-center", { "picks-no-pick": !game.pick })}>
        <b>{ Math.round(odds*100) + "%" }</b>
        </div>
        <div className="picks-column">
          <Button bsSize="xsmall" bsStyle="default" onClick={this.setPick(index, Math.random() < .5 ? game.home : game.away)}>Coin Flip</Button>
        </div>
        <div className="picks-column picks-randomize">
          <Button bsSize="xsmall" bsStyle="default" onClick={this.setPick(index, Math.random() < odds ? game.favorite : (game.home === game.favorite ? game.away : game.home))}>Randomize Based On Odds</Button>
        </div>
      </div>
    ));
  }
}
export default DropTarget(ItemType, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
DragSource(ItemType, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(Card));
