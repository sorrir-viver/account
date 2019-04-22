import React from 'react';

import { Row } from 'antd';

export default function(props) {
  return (
    <Row
      type="flex"
      justify="center"
      position="static"
      style={{
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
      }}
      {...props}
    />
  );
}

