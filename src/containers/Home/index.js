import React from 'react';
import { Typography } from 'antd';

import Header from '../../components/header';
import Body from '../../components/body';
import Widget from '../../components/widget';
import Footer from '../../components/footer';

export default (props) => [
  <Header key="h" />,
  <Body key="b">
    <div>home - account - Sorrir & Viver</div>
  </Body>,
  <Footer key="f" />,
];
