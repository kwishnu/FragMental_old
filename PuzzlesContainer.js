import React, { PropTypes } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Puzzles from './Puzzles';

const PuzzlesContainer = ({ puzzlesReady, navigator}) => {
  return (
    <Puzzles
      puzzlesReady={puzzlesReady} navigator={navigator} id={'puzzle contents'}
    />
  );
};

PuzzlesContainer.propTypes = {
  puzzlesReady: PropTypes.bool,
};

export default createContainer(() => {
  const handle = Meteor.subscribe('AllData');//('AllData');('PuzzlesList');
  return {
    puzzlesReady: handle.ready(),
  };
}, PuzzlesContainer);
