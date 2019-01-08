import React from 'react';
import { observable, action, toJS, autorun, computed } from 'mobx';
import { notification, Tree } from 'antd';
import Highlighter from './HighLight';

import { TIME_RANGE, getUrl } from '../util';



class store {
  systemList = [
    {
      name: 'moliere',
      value: 'fe_moliere'
    },
    {
      name: 'moliere-app',
      value: '80040'
    },
    {
      name: 'tms',
      value: 'fe_tms_2018'
    },
    {
      name: '小鲜司机Android',
      value: '80110'
    },
    {
      name: '小鲜司机iOS',
      value: '60110'
    },
  ]
  quikTimeList = [
    {
      name: 'last 15 minutes',
      value: 'last15Minutes',
    },
    {
      name: 'last 30 minutes',
      value: 'last30Minutes',
    },
    {
      name: 'last 1 hour',
      value: 'last1Hour',
    },
    {
      name: 'last 3 hours',
      value: 'last3Hours',
    },
    {
      name: 'last 6 hours',
      value: 'last6Hours',
    },
    {
      name: 'last half day',
      value: 'lastHalfDay',
    },
    {
      name: 'last 1 day',
      value: 'last1Day',
    },
    {
      name: 'last 1 week',
      value: 'last1Week',
    },
  ]
  defaultCheckList = ['client_time', 'gid', 'entry_detail']
  @observable model = {
    quikRange: 'last15Minutes',
    system: '80040'
  };
  @observable dataSource = [];
  @observable columns = [];
  @observable total = 0;
  @observable loading = false;
  @observable expand = false;

  @observable siderData = {};
  @observable findWord = '';
  @observable activeKey = {};
  @observable matchedNum = 0;
  stashActiveKey = {};


  @action.bound
  onChange(value, field) {
    Object.assign(this.model, { [field]: value });
  }
  @action.bound
  onCheck(value, field) {
    Object.assign(this.siderData, { [field]: value });
  }
  @computed get tableData() {
    return toJS(this.dataSource);
  }
  @computed get getColumns() {
    return toJS(this.columns);
  }
  changeTime = autorun(() => {
    if (this.model.quikRange) {
      const timeRange = TIME_RANGE[this.model.quikRange]();
      this.onChange(timeRange, 'timeRange');
    }
  })
  sorter = (a, b) => new Date(String(a.client_time)) - new Date(String(b.client_time))
  changeColumns = autorun(() => {
    Object.keys(this.activeKey).map(d => d);
    this.columns = Object.keys(this.siderData).filter(key => this.siderData[key]).map(key => ({
      title: key,
      dataIndex: key,
      defaultSortOrder: 'ascend',
      sorter: key === 'client_time' && this.sorter,
      render: (value, r, i) => {
        const k = `${key}-${i}`;
        this.stashActiveKey[k] = k;
        if (typeof value === 'object') {

          const data = JSON.stringify(value, null, 4);
          if (key === 'entry_detail') {
            const header = data.slice(0, 50) + '...';
            return (<Tree
              autoExpandParent={false}
              expandedKeys={[this.activeKey[k]]}
              onExpand={(expandedKeys, status) => this.onExpand(k, status)}
            >
              <Tree.TreeNode key={k} title={header} >
                <Tree.TreeNode title={this.renderHightLight(data)} />
              </Tree.TreeNode>

            </Tree>);
          }
          return this.renderHightLight(data);
        }
        return this.renderHightLight(value);
      }
    }));
  })
  renderHightLight = (data) => (<Highlighter
    className="bg-second"
    searchWord={this.findWord}
    sourceText={data}
    onMatch={this.onMatch}
  />)
  onMatch = () => {
    console.log('match');
    this.matchedNum += 1;
  }
  onExpand = (k, status) => {
    if (!status.expanded) {
      this.activeKey = {};
    } else {
      this.activeKey = { [k]: k };
    }
  }
  onSearch = () => {
    this.model.findWord = this.findWord = '';
    this.matchedNum = 0;
    this.fetchTable();
  };
  okRange = () => {
    delete this.model.quikRange;
  };

  onFindInput = () => {
    // this.matchedNum = 0;
    this.findWord = this.model.findWord;
    this.activeKey = { ...this.stashActiveKey };
  }

  fetchTable = () => {
    const { timeRange, system, search } = toJS(this.model);
    const size = 1000;
    const fromMilliseconds = timeRange[0].valueOf();
    const toMilliseconds = timeRange[1].valueOf();
    const queryString = search ? `pid:${system} AND ${search}` : `pid:${system}`;
    const param1 = {
      index: [
        'fe_app_log*',
      ],
      ignore_unavailable: true,
      preference: 1543335722142, // TODO 这是啥
    };

    const querys = [{
      query_string: {
        query: queryString,
        analyze_wildcard: true,
      },
    }];

    const param2 = {
      version: true,
      size,
      sort: [
        {
          '@timestamp': {
            order: 'desc',
            unmapped_type: 'boolean',
          },
        },
      ],
      query: {
        bool: {
          must: [
            ...querys,
            {
              range: {
                '@timestamp': {
                  gte: fromMilliseconds,
                  lte: toMilliseconds,
                  format: 'epoch_millis',
                },
              },
            },
          ],
          must_not: [],
        },
      },
      _source: {
        excludes: [],
      },
      aggs: {
        2: {
          date_histogram: {
            field: '@timestamp',
            interval: '30m',
            time_zone: 'Asia/Shanghai',
            min_doc_count: 1,
          },
        },
      },
      stored_fields: [
        '*',
      ],
      script_fields: {},
      docvalue_fields: [
        '@timestamp',
      ],
    };
    this.loading = true;
    fetch(getUrl(), {
      credentials: 'include',
      headers: {
        accept: 'application/json, text/plain, */*, text/html;charset=UTF-8', 'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6', 'content-type': 'application/x-ndjson', 'kbn-version': '5.6.10'
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      body: `${JSON.stringify(param1)}\n${JSON.stringify(param2)}\n`,
      method: 'POST',
      mode: 'cors',
    }).then(res => {
      if (res.redirected) {
        throw new Error('请登录Kibana');
      }
      try {
        const json = res.json();
        return json;
      } catch (err) {
        throw new Error('数据解析错误');
      }
    }).then((res) => {
      this.loading = false;
      const data = res.responses[0];
      this.total = data.hits.total;


      if (data._shards.failed === 0) {
        if (data.hits.hits.length > 0) {
          this.dataSource = data.hits.hits.map((item) => {
            const msg = item._source.message.split('\t');
            return JSON.parse(msg.pop());
          });
          const fieldData = this.dataSource[0];
          Object.keys(fieldData).reduce((siderData, key) => {
            siderData[key] = false;
            if (this.defaultCheckList.indexOf(key) > -1) {
              siderData[key] = true;
            }
            return siderData;
          }, this.siderData);
        } else {
          this.clearTableData();
        }

      } else {
        this.clearTableData();
        const { caused_by } = data._shards.failures[0].reason;
        if (caused_by.type === 'parse_exception') {
          throw new Error('query语法错误');
        }
      }
    }).catch((err) => {
      this.loading = false;
      notification.error({ message: err.message });
    });
  };
  @action.bound
  clearTableData() {
    this.dataSource = [];
    this.siderData = {};
  }
}
export default new store();