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
    const { tableData, getColumns, loading, onFindInput, dataSource, model, onChange, highLightNum } = store;
    return (

      <C className={styles.contentContainer}>
        {
          dataSource.length > 0 && <div className={styles.contentSearch}>
            <Search
              placeholder="input search text"
              onSearch={onFindInput}
              value={model.findWord}
              enterButton
              onChange={e => onChange(e.target.value, 'findWord')}
              className="w400"
            />
            <div className={styles.contentNum}>搜索结果：{highLightNum}</div>
          </div>
        }
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