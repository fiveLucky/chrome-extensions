import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { DatePicker, Row, Col, Input, Select, Layout } from 'antd';
import styles from './index.less';
import store from './store';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const { Header: H } = Layout;
const { Option } = Select;

@observer
export default class Header extends Component {

  componentDidMount() {

  }

  render() {
    const { model, onChange, okRange } = store;
    const { system, timeRange, quikRange, search } = model;
    return (
      <H className={styles.headerContainer}>
        <Row>
          <Col span={7}>
            <label>系统：</label>
            <Select
              defaultValue="80040"
              value={system}
              onChange={value => onChange(value, 'system')}
              className={styles.headerSelect}
              placeholder="请选择系统"
            >
              {
                store.systemList.map(item =>
                  (<Option key={item.value} value={item.value}>{item.name}【{item.value}】</Option>))
              }
            </Select>
          </Col>
          <Col span={10}>
            <label htmlFor="">时间范围：</label>
            <RangePicker
              value={timeRange}
              onChange={value => onChange(value, 'timeRange')}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              className={styles.headerPicker} />
          </Col>
          <Col span={7}>
            <label>快捷时间：</label>
            <Select
              placeholder="选择快捷时间"
              value={quikRange}
              onChange={value => onChange(value, 'quikRange')}
              className={styles.headerSelect}
              onOk={okRange}
            >
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
            onChange={e => onChange(e.target.value, 'search')}
            onSearch={store.onSearch}
            className={styles.headerInput}
            value={search}
          />
        </Row>
      </H>
    );
  }
}