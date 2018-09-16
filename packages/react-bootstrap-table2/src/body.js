/* eslint react/prop-types: 0 */
/* eslint react/require-default-props: 0 */

import React from 'react';
import PropTypes from 'prop-types';

import _ from './utils';
import Row from './simple-row';
import RowAggregator from './row-aggregator';
import RowSection from './row-section';
import Const from './const';
import bindSelection from './row-selection/row-binder';
import bindExpansion from './row-expand/row-binder';

class Body extends React.Component {
  constructor(props) {
    super(props);
    if (props.cellEdit.createContext) {
      this.EditingCell = props.cellEdit.createEditingCell(_, props.cellEdit.options.onStartEdit);
    }
    this.RowComponent = bindSelection(RowAggregator);
  }

  render() {
    const {
      columns,
      data,
      keyField,
      isEmpty,
      noDataIndication,
      visibleColumnSize,
      cellEdit,
      selectRow,
      rowStyle,
      rowClasses,
      rowEvents,
      expandRow
    } = this.props;

    let content;

    if (isEmpty) {
      const indication = _.isFunction(noDataIndication) ? noDataIndication() : noDataIndication;
      if (!indication) {
        return null;
      }
      content = <RowSection content={ indication } colSpan={ visibleColumnSize } />;
    } else {
      let RowComponent = Row;
      const selectRowEnabled = selectRow.mode !== Const.ROW_SELECT_DISABLED;
      const expandRowEnabled = !!expandRow.renderer;

      const additionalRowProps = {};
      if (expandRowEnabled) {
        RowComponent = bindExpansion(RowAggregator, visibleColumnSize);
      }

      // if (selectRowEnabled) {
      //   RowComponent = bindSelection(expandRowEnabled ? RowComponent : RowAggregator);
      // }

      if (cellEdit.createContext) {
        RowComponent = cellEdit.bindRowLevelCellEdit(RowComponent, selectRowEnabled, keyField, _);
        additionalRowProps.EditingCellComponent = this.EditingCell;
      }

      if (selectRowEnabled || expandRowEnabled) {
        additionalRowProps.expandRow = expandRow;
        additionalRowProps.selectRow = selectRow;
      }

      content = data.map((row, index) => {
        const key = _.get(row, keyField);
        const baseRowProps = {
          key,
          row,
          columns,
          keyField,
          cellEdit,
          value: key,
          rowIndex: index,
          attrs: rowEvents || {},
          ...additionalRowProps
        };

        baseRowProps.style = _.isFunction(rowStyle) ? rowStyle(row, index) : rowStyle;
        baseRowProps.className = (_.isFunction(rowClasses) ? rowClasses(row, index) : rowClasses);

        return <this.RowComponent { ...baseRowProps } />;
      });
    }

    return (
      <tbody>{ content }</tbody>
    );
  }
}

Body.propTypes = {
  keyField: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  selectRow: PropTypes.object
};

export default Body;
