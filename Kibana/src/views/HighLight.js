import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class HighLight extends Component {
  static propTypes = {
    sourceText: PropTypes.string,
    searchWord: PropTypes.string,
    className: PropTypes.string,
    // onMatch: PropTypes.function,
  }


  render() {
    const { sourceText, searchWord, className } = this.props;
    let st = sourceText;
    const placehoder = '@#$%';
    if (searchWord && sourceText.includes(searchWord)) {
      st = sourceText.replace(new RegExp(searchWord, 'g'), () => {
        // onMatch();
        return `${placehoder}${searchWord}${placehoder}`;
      }).split(placehoder).map(str => {
        if (str === searchWord) {
          return <span className={className}>{searchWord}</span>;
        } else {
          return <span>{str}</span>;
        }
      });
    }
    return (
      <span>{st}</span>
    );
  }
}