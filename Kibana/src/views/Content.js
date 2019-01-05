import React, { Component } from 'react';
import { Layout, Table, Input } from 'antd';
import { observer } from 'mobx-react';

import store from './store';
import styles from './index.less';

const { Content: C } = Layout;
const { Search } = Input;

@observer
export default class Content extends Component {






  render() {
    const { tableData, getColumns, loading, onFindInput } = store;
    return (

      <C className={styles.contentContainer}>
        <Search
          placeholder="input search text"
          onSearch={onFindInput}
          className={styles.contentSearch}
          enterButton
        />
        <Table
          dataSource={tableData}
          columns={getColumns}
          loading={loading}
          pagination={{ position: 'top', showSizeChanger: true, size: 'small' }}
        />
      </C>
    );
  }
}