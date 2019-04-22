import React from 'react';
import styled from 'styled-components';

// widget
const WidgetStyled = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 4px;
`;

const WidgetContent = function(props) {
  return <WidgetStyled {...props}>{props.children}</WidgetStyled>;
};
// widget

// header
const HeaderStyled = styled.div`
  border-bottom: 1px solid #ddd;
  height: 40px;
  display: flex;
  align-items: center;
`;

const HeaderContent = function(props) {
  return <HeaderStyled>{props.children}</HeaderStyled>;
};

const HeaderIconStyled = styled.div`
  height: 35px;
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.position === 'right' &&
    `
        margin-left: auto;
    `}
`;

const HeaderIconContent = function(props) {
  return <HeaderIconStyled {...props}>{props.children}</HeaderIconStyled>;
};

const HeaderTextStyled = styled.h3`
  margin: 0;
  font-weight: bold;
`;

const HeaderTextContent = function(props) {
  return <HeaderTextStyled>{props.children}</HeaderTextStyled>;
};

HeaderContent.Icon = HeaderIconContent;
HeaderContent.Text = HeaderTextContent;
// header

// body
const BodyStyled = styled.div`
  padding: 10px;
`;

const BodyContent = function(props) {
  return <BodyStyled>{props.children}</BodyStyled>;
};
// body

WidgetContent.Header = HeaderContent;
WidgetContent.Body = BodyContent;

export default WidgetContent;
