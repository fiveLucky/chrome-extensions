import React, { Component } from 'react';
import { Layout, Table } from 'antd';
import { observer } from 'mobx-react';

import store from './store';

const { Content: C } = Layout;


@observer
export default class Content extends Component {






  render() {
    return (

      <C>
        <Table
          dataSource={store.tableData}
          columns={store.getColumns}
        />

      </C>
    );
  }
}