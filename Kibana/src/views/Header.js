import React, { Component } from 'react';

import { DatePicker, Row, Col, Input, Layout } from 'antd';
import styles from './index.less';
const { Header: H } = Layout;
const Search = Input.Search;
export default class Header extends Component {






  render() {
    return (

      <H className={styles.headerContainer}>
        <Row>
          <Col span={12}>
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="large"
              onSearch={value => console.log(value)}
            />
          </Col>
          <Col span={12}>
            <DatePicker></DatePicker>
          </Col>
        </Row>
      </H>
    )
  }
}