import React, { Component } from 'react';

import { DatePicker, Row, Col, Input, Select } from 'antd';
import styles from './index.less';
import store from './store';

const { RangePicker } = DatePicker;
const Search = Input.Search;

const { Option } = Select;

export default class Header extends Component {


  render() {
    return (
      <div className={styles.headerContainer}>
        <Row>
          <Col span={8}>
            <label>系统：</label>
            <Select defaultValue="80040" onChange={store.onSelect} className={styles.headerSelect}>
              {
                store.systemList.map(item =>
                  (<Option key={item.value} value={item.value}>{item.name}</Option>))
              }
            </Select>
          </Col>
          <Col span={16}>
            <label htmlFor="">时间范围：</label>
            <RangePicker className={styles.headerPicker} />
          </Col>

        </Row>
        <Row>
          <Col span={8}></Col>
          <Col span={16}>
            <label>快捷时间：</label>
            <Select placeholder="选择时间范围" onChange={store.onSelect} className={styles.headerSelect}>
              {
                store.quikTimeList.map(item => (<Option key={item.value} value={item.value}>{item.name}</Option>))
              }
            </Select>
          </Col>
        </Row>
        <Row>
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            onSearch={value => console.log(value)}
            className={styles.headerInput}
          />
        </Row>
      </div>
    );
  }
}