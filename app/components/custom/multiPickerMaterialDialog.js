import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
// import { material } from 'react-native-typography';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalDialog from './modalDialog';
import {  Icon } from 'native-base';

import colors from './colors';
export default class MultiPickerMaterialDialog extends Component {
  constructor(props) {
    super(props);

    const { selectedItems } = props;
    const selected = new Map();
    selectedItems.forEach((item) => {
      selected.set(item.value, true);
    });

    this.state = { selected };

  }

  setSelectedItemsChange(selectedItems){
    const selected = new Map();
    console.log("setSelectedItemsChange: selectedItems = "+selectedItems)
    selectedItems.forEach((item) => {
      selected.set(item.value, true);
      console.log("setSelectedItemsChange: item.value = "+item.value)

    });
    this.setState({selected})
  }

  onPressItem(value) {
    this.setState((prevState) => {
      const selected = new Map(prevState.selected);
      selected.set(value, !selected.get(value));
      return { selected };
    });
  }

  keyExtractor = item => String(item.value);

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressItem(item.value)}>
      <View style={styles.rowContainer}>
        <View style={styles.iconContainer}>
          {/* <Icon
            name={
              this.state.selected.get(item.value)
              ? require('../../../images/checkbox_checked.png')//'md-checkbox'//check-box
              : require('../../../images/checkbox_empty.png')//'md-checkbox-outline'//check-box-outline-blank
            }
            color={this.props.colorAccent}
            size={24}
          /> */}
           <Image source={this.state.selected.get(item.value)
              ? require('../../../images/checkbox_checked.png')
              : require('../../../images/checkbox_empty.png')}
              style={{ width: 24, height: 24}} />
        </View>
        {/* <Text style={material.subheading}>{item.label}</Text> */}
        <Text>{item.label}</Text>

      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <ModalDialog
        title={this.props.title}
        titleColor={this.props.titleColor}
        colorAccent={this.props.colorAccent}
        visible={this.props.visible}
        okLabel={this.props.okLabel}
        scrolled={this.props.scrolled}
        onOk={() =>
          this.props.onOk({
            selectedItems: this.props.items.filter(item =>
              this.state.selected.get(item.value),
            ),
          })
        }
        cancelLabel={this.props.cancelLabel}
        onCancel={this.props.onCancel}
      >
        <FlatList
          data={this.props.items}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
        />
      </ModalDialog>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    height: 56,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
    marginLeft:8,
  },
});

// MultiPickerMaterialDialog.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   items: PropTypes.arrayOf(PropTypes.object).isRequired,
//   selectedItems: PropTypes.arrayOf(PropTypes.object),
//   title: PropTypes.string,
//   titleColor: PropTypes.string,
//   colorAccent: PropTypes.string,
//   onCancel: PropTypes.func.isRequired,
//   onOk: PropTypes.func.isRequired,
//   cancelLabel: PropTypes.string,
//   okLabel: PropTypes.string,
//   scrolled: PropTypes.bool,
// };

MultiPickerMaterialDialog.defaultProps = {
  selectedItems: [],
  title: undefined,
  titleColor: undefined,
  colorAccent: colors.androidColorAccent,
  cancelLabel: undefined,
  okLabel: undefined,
  scrolled: false,
};