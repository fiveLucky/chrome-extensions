import React from 'react';
import { observable } from 'mobx';

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
      value: 'last15',
    },
    {
      name: 'last 30 minutes',
      value: 'last30',
    },
    {
      name: 'last 1 hour',
      value: 'lastOne',
    },
    {
      name: 'last 3 hour',
      value: 'lastThree',
    },
    {
      name: 'last 6 hour',
      value: 'lastSix',
    },
    {
      name: 'last 12 hour',
      value: 'lastTwelve',
    },
    {
      name: 'today',
      value: 'today',
    },
    {
      name: 'this week',
      value: 'week',
    },
  ]
}

export default new store();