import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { Row, Col, Typography, Form, Icon, Input, Button, Checkbox } from 'antd';

import utility from '@ciro-maciel/utility';

import Header from '../../components/header';
import Body from '../../components/body';
import Widget from '../../components/widget';
import Footer from '../../components/footer';

const MUTATION_SIGNIN = gql`
  mutation MutationSignIn($email: String!, $password: String!, $stayLogged: Boolean!) {
    userSignIn(
      email: $email
      password: $password
      stayLogged: $stayLogged
      session: { ip: "sasas", location: "121212", agent: "3434" }
    ) {
      code
      token
      user {
        id
        userName
        email {
          address
          public
        }
        profile {
          biography
          birth
          gender
          name {
            first
            last
          }
          company
          location
          site
        }
        photo {
          data
          type
        }
        locale
        clinic {
          id
          name
          birth
          address {
            code
            street
            number
          }
          phone {
            type
            number
          }
          team {
            userId
            type
            active
          }
        }
      }
    }
  }
`;

class formSignIn extends Component {
  state = {
    email: '',
    password: '',
    stayLogged: false,
  };

  saveUserAuthorization = (authorization, stayLogged) => {
    try {
      let validAt = new Date();

      validAt.setDate(validAt.getDate() + (stayLogged ? 30 : 1));

      let domain = window.location.hostname === 'localhost' ? 'localhost' : 'sorrir-viver.com.br';

      console.log(authorization.user);

      utility.navigator.cookie.add('token', authorization.token, validAt, '/', domain);
      utility.navigator.cookie.add('user', JSON.stringify(authorization.user), validAt, '/', domain);

      return true;
    } catch (error) {
      return false;
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { email, password, stayLogged } = this.state;

    return [
      <Header key="h" />,
      <Body key="b">
        <Row type="flex" justify="center" style={{ width: '1200px', alignItems: 'center' }}>
          <Col xs={24} md={8} style={{ padding: '10px' }}>
            <Typography.Title level={3}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Typography.Title>
            <Typography.Paragraph>
              Vitae et leo duis ut diam quam nulla. Eleifend donec pretium vulputate sapien nec sagittis aliquam. Libero
              id faucibus nisl tincidunt eget nullam non nisi. Congue mauris rhoncus aenean vel elit scelerisque mauris
              pellentesque. Pharetra pharetra massa massa ultricies mi quis hendrerit.
            </Typography.Paragraph>
            <Typography.Title level={3}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Typography.Title>
            <Typography.Paragraph>
              Vitae et leo duis ut diam quam nulla. Eleifend donec pretium vulputate sapien nec sagittis aliquam. Libero
              id faucibus nisl tincidunt eget nullam non nisi. Congue mauris rhoncus aenean vel elit scelerisque mauris
              pellentesque. Pharetra pharetra massa massa ultricies mi quis hendrerit.
            </Typography.Paragraph>
          </Col>
          <Col xs={24} md={8} style={{ padding: '10px 10px 2px 10px' }}>
            <Mutation
              mutation={MUTATION_SIGNIN}
              variables={{ email, password, stayLogged }}
              onCompleted={(authorization) => {
                authorization = authorization.userSignIn;

                switch (authorization.code) {
                  case '200':
                    if (this.saveUserAuthorization(authorization)) {
                      this.props.history.push('/');
                    } else {
                      this.props.form.setFields({
                        password: {
                          value: password,
                          errors: [new Error('Houve um erro para salvar suas Credenciais')],
                        },
                      });
                    }
                    break;
                  case '401':
                    this.props.form.setFields({
                      password: {
                        value: password,
                        errors: [new Error('Senha incorreta. Tente novamente')],
                      },
                    });
                    break;
                  case '404':
                    this.props.form.setFields({
                      email: {
                        value: email,
                        errors: [new Error('Não foi possível encontrar sua conta Sorrir & Viver')],
                      },
                    });
                    break;
                  case '410':
                    this.props.form.setFields({
                      email: {
                        value: email,
                        errors: [new Error('Sua conta foi excluída. Entre em contato com nosso Suporte')],
                      },
                    });
                    break;
                  case '423':
                    this.props.form.setFields({
                      email: {
                        value: email,
                        errors: [new Error('Sua conta não foi ativada. Verifique sua caixa de email')],
                      },
                    });
                    break;
                  default:
                    break;
                }
              }}>
              {(userSignIn, { loading }) => (
                <Widget>
                  <Widget.Header>
                    <Widget.Header.Icon>
                      {/* 🧑 */}
                      <Icon type="user" />
                    </Widget.Header.Icon>
                    <Widget.Header.Text>Autenticação</Widget.Header.Text>
                  </Widget.Header>
                  <Widget.Body>
                    <div style={{ textAlign: 'center' }}>
                      <Typography.Title level={3}>Faça login na sua conta</Typography.Title>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '0 0 8px',
                      }}>
                      <Link to="/signup">Criar nova conta</Link>
                    </div>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        this.props.form.validateFields((err, values) => {
                          if (!err) {
                            userSignIn();
                          }
                        });
                      }}>
                      <Form.Item>
                        {getFieldDecorator('email', {
                          initialValue: email,
                          rules: [{ required: true, message: 'Este campo é necessário' }],
                        })(
                          <Input
                            prefix={<Icon type="mail" />}
                            placeholder="Email"
                            onChange={(e) => this.setState({ email: e.target.value })}
                          />
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('password', {
                          initialValue: password,
                          rules: [{ required: true, message: 'Este campo é necessário' }],
                        })(
                          <Input.Password
                            prefix={<Icon type="lock" />}
                            type="password"
                            placeholder="Password"
                            onChange={(e) => this.setState({ password: e.target.value })}
                          />
                        )}
                      </Form.Item>
                      <Form.Item>
                        {getFieldDecorator('stayLogged', {
                          initialValue: stayLogged,
                        })(
                          <Checkbox
                            style={{ float: 'right' }}
                            onChange={(e) => this.setState({ stayLogged: e.target.value })}>
                            Permanecer conectado
                          </Checkbox>
                        )}
                      </Form.Item>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/password">Esqueceu sua senha?</Link>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon="check"
                          loading={loading}
                          style={{ marginLeft: 'auto' }}>
                          Entrar
                        </Button>
                      </div>
                    </Form>
                  </Widget.Body>
                </Widget>
              )}
            </Mutation>
          </Col>
        </Row>
      </Body>,
      <Footer key="f" />,
    ];
  }
}

export default Form.create({ name: 'formSignIn' })(formSignIn);
