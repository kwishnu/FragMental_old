import React, { PropTypes } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import Puzzles from './Puzzles';

const PuzzlesContainer = ({ puzzlesReady }) => {
  return (
    <Puzzles
      puzzlesReady={puzzlesReady}
    />
  );
};

PuzzlesContainer.propTypes = {
  puzzlesReady: PropTypes.bool,
};

export default createContainer(() => {
  const handle = Meteor.subscribe('AllData');
  return {
    puzzlesReady: handle.ready(),
  };
}, PuzzlesContainer);
