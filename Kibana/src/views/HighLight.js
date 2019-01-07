import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class HighLight extends Component {
  static propTypes = {
    sourceText: PropTypes.string,
    searchWord: PropTypes.string,
    className: PropTypes.string,
    onMatch: PropTypes.function,
  }


  render() {
    const { sourceText, searchWord, className, onMatch } = this.props;
    let st = sourceText;
    if (searchWord && sourceText.includes(searchWord)) {
      st = sourceText.split(searchWord).map(str => {
        if (str === "") {
          return <span className={className}>{searchWord}</span>;
        } else {
          return <span>{str}</span>;
        }
      });
      onMatch();
    }
    return (
      <span>{st}</span>
    );
  }
}