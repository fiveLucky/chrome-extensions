import React, { Component } from 'react';

import { Layout } from 'antd'

import Header from './Header'
import Sider from './Sider'
import Content from './Content'

export default class Index extends Component {



  render() {
    return (
      <div>
        <Layout>
            <Sider />
            <Layout>
              <Header />
              <Content />
            </Layout>
        </Layout>
      </div>
    )
  }
}