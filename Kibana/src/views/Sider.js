import React, { Component } from 'react';
import { Layout, Switch } from 'antd';
import { observer } from 'mobx-react';


import styles from './index.less';
import store from './store';

const { Sider: S } = Layout;


@observer
export default class Sider extends Component {






  render() {
    const { siderData, onCheck } = store;
    return (

      <S className={styles.siderContainer}>
        {
          Object.keys(siderData).map(key =>
            (<div className={styles.siderRow} key={key}>
              <div className={styles.siderLabel}>{key} </div>
              <Switch
                checked={siderData[key]}
                onChange={value => onCheck(value, key)}
                className={styles.siderSwitch}
                size="small"
              >{key}</Switch></div>))
        }
      </S>
    );
  }
}