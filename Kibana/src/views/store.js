import { observable, action, toJS, autorun } from 'mobx';
import { TIME_RANGE } from '../util';
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
      value: 'fe_tms_pc_2018'
    },
    {
      name: 'tms-app',
      value: '80013'
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

  @observable model = {
    quikRange: 'last15Minutes',
    system: '80040'
  };
  param = {}

  @action.bound
  onChange(value, field) {
    Object.assign(this.model, { [field]: value });
  }
  autoChange = autorun(() => {
    if (this.model.quikRange) {
      const timeRange = TIME_RANGE[this.model.quikRange]();
      this.onChange(timeRange, 'timeRange');
    }
  })
  onSearch = () => {
    const p = toJS(this.model);
    console.log(p);
  }
  okRange = () => {
    delete this.model.quikRange;
  }





}

export default new store();