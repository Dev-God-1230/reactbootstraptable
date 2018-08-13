/* eslint react/prop-types: 0 */
/* eslint react/no-array-index-key: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from './utils';
import Cell from './cell';
import SelectionCell from './row-selection/selection-cell';
import ExpandCell from './row-expand/expand-cell';
import eventDelegater from './row-event-delegater';
import Const from './const';

class Row extends eventDelegater(Component) {
  render() {
    const {
      row,
      columns,
      keyField,
      rowIndex,
      className,
      style,
      attrs,
      cellEdit,
      selected,
      selectRow,
      expanded,
      expandRow,
      selectable,
      editable: editableRow
    } = this.props;

    const {
      mode,
      onStart,
      EditingCell,
      ridx: editingRowIdx,
      cidx: editingColIdx,
      CLICK_TO_CELL_EDIT,
      DBCLICK_TO_CELL_EDIT,
      ...rest
    } = cellEdit;

    const key = _.get(row, keyField);
    const { hideSelectColumn } = selectRow;
    const { showExpandColumn } = expandRow || {};
    const trAttrs = this.delegate(attrs);

    return (
      <tr style={ style } className={ className } { ...trAttrs }>
        {
          showExpandColumn ? (
            <ExpandCell
              { ...expandRow }
              rowKey={ key }
              rowIndex={ rowIndex }
              expanded={ expanded }
            />
          ) : null
        }
        {
          (selectRow.mode !== Const.ROW_SELECT_DISABLED && !hideSelectColumn)
            ? (
              <SelectionCell
                { ...selectRow }
                rowKey={ key }
                rowIndex={ rowIndex }
                selected={ selected }
                disabled={ !selectable }
              />
            )
            : null
        }
        {
          columns.map((column, index) => {
            if (!column.hidden) {
              const { dataField } = column;
              const content = _.get(row, dataField);
              let editable = _.isDefined(column.editable) ? column.editable : true;
              if (dataField === keyField || !editableRow) editable = false;
              if (_.isFunction(column.editable)) {
                editable = column.editable(content, row, rowIndex, index);
              }
              if (rowIndex === editingRowIdx && index === editingColIdx) {
                let editCellstyle = column.editCellStyle || {};
                let editCellclasses = column.editCellClasses;
                if (_.isFunction(column.editCellStyle)) {
                  editCellstyle = column.editCellStyle(content, row, rowIndex, index);
                }
                if (_.isFunction(column.editCellClasses)) {
                  editCellclasses = column.editCellClasses(content, row, rowIndex, index);
                }
                return (
                  <EditingCell
                    key={ `${content}-${index}` }
                    row={ row }
                    rowIndex={ rowIndex }
                    column={ column }
                    columnIndex={ index }
                    className={ editCellclasses }
                    style={ editCellstyle }
                    { ...rest }
                  />
                );
              }
              // render cell
              let cellTitle;
              let cellStyle = {};
              const cellAttrs = {
                ..._.isFunction(column.attrs)
                  ? column.attrs(content, row, rowIndex, index)
                  : column.attrs,
                ...column.events
              };

              const cellClasses = _.isFunction(column.classes)
                ? column.classes(content, row, rowIndex, index)
                : column.classes;

              if (column.style) {
                cellStyle = _.isFunction(column.style)
                  ? column.style(content, row, rowIndex, index)
                  : column.style;
                cellStyle = Object.assign({}, cellStyle) || {};
              }


              if (column.title) {
                cellTitle = _.isFunction(column.title)
                  ? column.title(content, row, rowIndex, index)
                  : content;
                cellAttrs.title = cellTitle;
              }

              if (column.align) {
                cellStyle.textAlign =
                  _.isFunction(column.align)
                    ? column.align(content, row, rowIndex, index)
                    : column.align;
              }

              if (cellClasses) cellAttrs.className = cellClasses;
              if (!_.isEmptyObject(cellStyle)) cellAttrs.style = cellStyle;

              return (
                <Cell
                  key={ `${content}-${index}` }
                  row={ row }
                  rowIndex={ rowIndex }
                  columnIndex={ index }
                  column={ column }
                  onStart={ onStart }
                  editable={ editable }
                  clickToEdit={ mode === CLICK_TO_CELL_EDIT }
                  dbclickToEdit={ mode === DBCLICK_TO_CELL_EDIT }
                  { ...cellAttrs }
                />
              );
            }
            return false;
          })
        }
      </tr>
    );
  }
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  attrs: PropTypes.object
};

Row.defaultProps = {
  editable: true,
  style: {},
  className: null,
  attrs: {}
};

export default Row;
