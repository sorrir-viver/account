import React from 'react';
import styled from 'styled-components';

const ContentStyled = styled.div`
  display: block;
  width: 54.16666667%;
  box-sizing: border-box;
  float: left;
  padding: 0 10px;
  @media (max-width: 767px) {
    width: 100%;
    padding: 7px 0 10px;
  }
`;

const Content = function(props) {
  return <ContentStyled {...props} />;
};

export default Content;
