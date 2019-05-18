import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Menu, Dropdown, Icon, Avatar, Badge } from 'antd';

import utility from '@ciro-maciel/utility';

const menuUSer = (props, user) => {
  return (
    <Menu mode="vertical">
      {user &&
        user.clinic.length > 0 && [
          <Menu.ItemGroup key="1" title="Perfis de Acesso" style={{ display: 'list-item', fontWeight: 'bold' }}>
            {user.clinic[0].team.map((team) => {
              return (
                <Menu.Item key={new Date().getTime()}>
                  <Icon type="user" />
                  {team.type === 'administrator' && <span>Administrador(a)</span>}
                  {team.type === 'dentist' && <span>Dentista</span>}
                  {team.type === 'secretary' && <span>Secretária(o)</span>}
                </Menu.Item>
              );
            })}
          </Menu.ItemGroup>,
          <Menu.Divider key="1Q" />,
        ]}

      <Menu.Item key="14">
        <Icon type="setting" />
        Configurações
      </Menu.Item>
      <Menu.Item key="22">
        <Icon type="lock" />
        Histórico de Acessos
      </Menu.Item>
      <Menu.Item key="212">
        <Icon type="mail" />
        Mensagens &ensp;
        <Badge count={19} />
      </Menu.Item>
      <Menu.Item key="53">
        <Icon type="question" />
        <a href="https://support.sorrir-viver.com.br/odontology" target="_blank">
          Ajuda
        </a>
      </Menu.Item>

      <Menu.Divider />
      <Menu.Item
        key="83"
        onClick={(e) => {
          var domain = window.location.hostname === 'localhost' ? 'localhost' : 'sorrir-viver.com.br';

          utility.navigator.cookie.remove('user', '/', domain);
          utility.navigator.cookie.remove('token', '/', domain);

          props.history.push('/signin');
        }}>
        <Icon type="logout" />
        <Link to="/signin">Sair</Link>
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item key="3">
        <a href="https://sorrir-viver.com.br/about" target="_blank">
          Sobre a Sorrir & Viver
        </a>
      </Menu.Item>
    </Menu>
  );
};

const menuClinic = (clinics) => (
  <Menu>
    {clinics.map((clinic) => {
      return (
        <Menu.Item key={clinic.id}>
          <a target="_blank" onClick={(e) => console.log(clinic.id)}>
            {clinic.name}
          </a>
        </Menu.Item>
      );
    })}
  </Menu>
);

// https://gist.github.com/ciro-maciel/8947cc611c23c9a9d96a98d2da04718c
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return width;
}

export default function(props) {
  const user = JSON.parse(utility.navigator.cookie.get('user'));
  return (
    <Row
      type="flex"
      justify="center"
      style={{
        borderBottom: '1px solid #ddd',
        height: '40px',
        width: '100%',
        padding: '0 10px',
      }}>
      <Row style={{ width: '1200px', padding: '10px 0', alignItems: 'center', display: 'flex' }}>
        <Col span={24} style={{ alignItems: 'center', display: 'flex' }}>
          <div style={{ fontSize: '16px' }}>
            <Link to="/">
              <strong style={{ color: '#1890ff' }}>Account ;-)</strong>
            </Link>
          </div>
          {user && (
            <div style={{ marginLeft: 'auto' }}>
              <Dropdown overlay={menuUSer(props, user)} trigger={['click']}>
                <div style={{ cursor: 'pointer' }}>
                  <Badge dot>
                    <Avatar shape="square" icon="user" size="small" />
                  </Badge>
                  &ensp;
                  <Link
                    to=""
                    onClick={(e) => {
                      e.preventDefault();
                    }}>
                    <span className="hide-on-mobile">
                      {user.profile.name.first} {user.profile.name.last}{' '}
                      <Icon className="hide-on-mobile" type="caret-down" />
                    </span>
                  </Link>
                </div>
              </Dropdown>
            </div>
          )}
        </Col>
      </Row>
    </Row>
  );
}
