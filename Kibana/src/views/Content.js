import React, { Component } from 'react';
import { Layout, Table } from 'antd';
import { observer } from 'mobx-react';

import store from './store';
import styles from './index.less';

const { Content: C } = Layout;


@observer
export default class Content extends Component {






  render() {
    const { tableData, getColumns, loading } = store;
    return (

      <C className={styles.contentContainer}>
        <Table
          dataSource={tableData}
          columns={getColumns}
          loading={loading}
        />
      </C>
    );
  }
}