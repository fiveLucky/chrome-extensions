import React, { Component } from 'react';
import { Layout, Table, Spin } from 'antd';
import { observer } from 'mobx-react';

import store from './store';

const { Content: C } = Layout;


@observer
export default class Content extends Component {






  render() {
    const { tableData, getColumns, loading } = store;
    return (

      <C>
        <Spin size="large" spinning={loading}>
          <Table
            dataSource={tableData}
            columns={getColumns}
          />
        </Spin>
      </C>
    );
  }
}