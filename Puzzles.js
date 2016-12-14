import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';
import { MeteorListView } from 'react-native-meteor';
//import Loading from '../../components/Loading';
//import styles from './styles';

const Puzzles = ({ puzzlesReady }) => {
  if (!puzzlesReady) {
    //return <Loading />;
  }

  return (
    <View>
      <MeteorListView
        //contentContainerStyle={styles.list}
        collection="text"
        renderRow={(detail) => <Text>{detail.text}</Text>}
      />
    </View>
  );
};

Puzzles.propTypes = {
  puzzlesReady: PropTypes.bool,
};

export default Puzzles;
