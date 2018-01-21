---
id: cell-edit-props
title: Cell Editing Props
---
Following we list all props for `cellEditFactory` from [`react-bootstrap-table2-editor`](https://www.npmjs.com/package/react-bootstrap-table2-editor).

```js
import cellEditFactory from 'react-bootstrap-table2-editor';

const cellEdit = cellEditFactory({
  mode: 'click',
  ...
});

<BootstrapTable cellEdit={ cellEdit } ... />
```


## Required
* [mode (**required**)](#celleditmode-string)

## Optional
* [blurToSave](#celleditblurtosave-bool)
* [nonEditableRows](#celleditnoneditablerows-function)
* [timeToCloseMessage](#celledittimetoclosemessage-function)
* [beforeSaveCell](#celleditbeforesavecell-function)
* [afterSaveCell](#celleditaftersavecell-function)
* [errorMessage](#cellediterrormessage-string)
* [onErrorMessageDisappear](#celleditonerrormessagedisappear-function)

-----

## cellEdit.mode - [String]
`cellEdit.mode` possible value is `click` and `dbclick`. **It's required value** that tell `react-bootstrap-table2` how to trigger the cell editing.

## cellEdit.blurToSave - [Bool]
Default is `false`, enable it will be able to save the cell automatically when blur from the cell editor.

## cellEdit.nonEditableRows - [Function]
`cellEdit.nonEditableRows` accept a callback function and expect return an array which used to restrict all the columns of some rows as non-editable. So the each item in return array should be rowkey(`keyField`)

## cellEdit.timeToCloseMessage - [Function]
If a [`column.validator`](./column-props.html#columnvalidator-function) defined and the new value is invalid, `react-bootstrap-table2` will popup a alert at the bottom of editor. `cellEdit.timeToCloseMessage` is a chance to let you decide how long the alert should be stay. Default is 3000 millisecond.

## cellEdit.beforeSaveCell - [Function]
This callback function will be called before triggering cell update.

```js
const cellEdit = {
  // omit...
  beforeSaveCell: (oldValue, newValue, row, column) => { ... }
}
```

## cellEdit.afterSaveCell - [Function]
This callback function will be called after updating cell.

```js
const cellEdit = {
  // omit...
  afterSaveCell: (oldValue, newValue, row, column) => { ... }
};
```

## cellEdit.errorMessage - [String]
This prop is not often used. Only used when you want to keep the error message in your application state and also handle the cell editing on [`remote`](./table-props.html#remote-bool-object) mode.

## cellEdit.onErrorMessageDisappear - [Function]
This callback function will be called when error message discard so that you can sync the newest error message to your state if you have.