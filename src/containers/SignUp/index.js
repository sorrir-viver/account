import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import gql from 'graphql-tag';
// https://www.apollographql.com/docs/react/api/react-apollo.html#withApollo
// https://stackoverflow.com/questions/39814853/apollo-graphql-react-how-to-query-on-click
import { Mutation, withApollo } from 'react-apollo';

import { Row, Col, Typography, Form, Button, Select, Input, Icon, InputNumber } from 'antd';

import Header from '../../components/header';
import Body from '../../components/body';
import Widget from '../../components/widget';
import Footer from '../../components/footer';

const MUTATION_USERSIGNUP = gql`
  mutation MutationUserSignUp(
    $nameFirst: String!
    $nameLast: String!
    $email: String!
    $mobileNumber: String!
    $birth: String!
    $locale: String!
    $gender: String!
    $password: String!
  ) {
    userSignUp(
      nameFirst: $nameFirst
      nameLast: $nameLast
      email: $email
      mobileNumber: $mobileNumber
      birth: $birth
      locale: $locale
      gender: $gender
      password: $password
      session: { ip: "1212", location: "sasas", agent: "s21212" }
    ) {
      code
    }
  }
`;

const QUERY_USERBYEMAIL = gql`
  query QuerysUserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
    }
  }
`;

class formSignUp extends Component {
  constructor(props) {
    super(props);
    // https://gist.github.com/ciro-maciel/8f721da842b5cdb2b691812db23a10cf
    this.emailValidate = this.debounce(this.emailValidate, 900);
  }

  state = {
    nameFirst: '',
    nameLast: '',
    email: '',
    emailIsValid: false,
    mobileNumber: '',
    birth: new Date(),
    locale: navigator.language,
    gender: '',
    password: '',
    passwordConfirm: '',
  };

  // https://stackoverflow.com/a/31106629/8589328
  // https://gist.github.com/ciro-maciel/8f721da842b5cdb2b691812db23a10cf
  debounce = (callback, time = 250, interval) => (...args) => {
    clearTimeout(interval, (interval = setTimeout(callback, time, ...args)));
  };

  emailOnChange = (value) => {
    if (value === undefined || value === '') return;

    this.setState({ email: value });

    this.emailValidate(value);
  };

  emailValidate = (value) => {
    this.props.client
      .query({
        query: QUERY_USERBYEMAIL,
        variables: { email: value },
      })
      .then(({ data }) => {
        if (data.userByEmail) {
          this.props.form.setFields({
            email: {
              value: value,
              errors: [new Error('Alguém já fez o cadastro com este e-mail')],
            },
          });
          return false;
        }
        return true;
      });
  };

  birthCalculed = (value, type) => {
    const { birth } = this.state;

    switch (type) {
      case 'day':
        birth.setDate(value);
        break;
      case 'month':
        birth.setMonth(value);
        break;
      case 'year':
        birth.setFullYear(value);
        break;
      default:
        break;
    }

    this.setState({ birth });
  };

  // https://gist.github.com/ciro-maciel/8b9ef3e728d7b9e3d658b000fa8f943f
  comparePassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && form.getFieldValue('password') !== form.getFieldValue('passwordConfirm')) {
      callback('As senhas não coincidem');
      // this.setState({submitDisabled: true});
    } else {
      // this.setState({submitDisabled: false});
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { nameFirst, nameLast, email, mobileNumber, birth, locale, gender, password } = this.state;

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
            <Widget>
              <Widget.Header>
                <Widget.Header.Icon>🧑🏻</Widget.Header.Icon>
                <Widget.Header.Text>Crie sua Conta</Widget.Header.Text>
              </Widget.Header>
              <Mutation
                mutation={MUTATION_USERSIGNUP}
                variables={{ nameFirst, nameLast, email, mobileNumber, birth, locale, gender, password }}
                onCompleted={(registration) => {
                  console.log(registration);

                  const code = registration.code;

                  this.props.history.push('/');
                }}>
                {(userSignUp, { loading }) => (
                  <Widget.Body>
                    <div style={{ textAlign: 'center' }}>
                      <Typography.Title level={3}>Preencha suas informações</Typography.Title>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        padding: '0 0 8px',
                      }}>
                      <span>Já tem cadastro?</span>
                      &ensp;
                      <Link to="/signin">Faça o login aqui</Link>
                    </div>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();

                        const emailIsError = this.props.form.getFieldError('email');

                        this.props.form.validateFieldsAndScroll((err, values) => {
                          if (values.email !== undefined && values.email !== '') {
                            this.emailValidate(email);

                            if (emailIsError) {
                              this.props.form.setFields({
                                email: {
                                  value: email,
                                  errors: [new Error('Alguém já fez o cadastro com este e-mail')],
                                },
                              });

                              return;
                            }
                          }

                          if (!err) {
                            userSignUp();
                          }
                        });
                      }}>
                      <Row>
                        <Col span={12} style={{ paddingRight: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('nameFirst', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Input
                                type="text"
                                prefix={<Icon type="user" />}
                                placeholder="Nome"
                                onChange={(e) => this.setState({ nameFirst: e.target.value })}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ paddingLeft: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('nameLast', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Input
                                type="text"
                                prefix={<Icon type="user" />}
                                placeholder="Sobrenome"
                                onChange={(e) => this.setState({ nameLast: e.target.value })}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Form.Item>
                            {getFieldDecorator('email', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Input
                                type="text"
                                prefix={<Icon type="mail" />}
                                placeholder="Email"
                                onChange={(e) => this.emailOnChange(e.target.value)}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={24} style={{ marginBottom: '5px' }}>
                          <strong>Nascimento</strong>
                        </Col>
                        <Col span={7}>
                          <Form.Item>
                            {getFieldDecorator('birthDay', {
                              rules: [{ required: true, message: 'Necessário' }],
                            })(
                              <InputNumber
                                placeholder="Dia"
                                style={{ width: '100%' }}
                                size={2}
                                min={1}
                                max={31}
                                onChange={(value) => this.birthCalculed(value, 'day')}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={10} style={{ padding: '0 10px' }}>
                          <Form.Item>
                            {getFieldDecorator('birthMonth', {
                              rules: [{ required: true, message: 'Necessário' }],
                            })(
                              <Select
                                placeholder="Mês"
                                style={{ width: '100%', top: '1px' }}
                                onChange={(value) => this.birthCalculed(value, 'month')}>
                                <Select.Option value="00">Janeiro</Select.Option>
                                <Select.Option value="01">Fevereiro</Select.Option>
                                <Select.Option value="02">Março</Select.Option>
                                <Select.Option value="03">Abril</Select.Option>
                                <Select.Option value="04">Maio</Select.Option>
                                <Select.Option value="05">Junho</Select.Option>
                                <Select.Option value="06">Julho</Select.Option>
                                <Select.Option value="07">Agosto</Select.Option>
                                <Select.Option value="08">Setembro</Select.Option>
                                <Select.Option value="09">Outubro</Select.Option>
                                <Select.Option value="10">Novembro</Select.Option>
                                <Select.Option value="11">Dezembro</Select.Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={7}>
                          <Form.Item>
                            {getFieldDecorator('birthYear', {
                              rules: [{ required: true, message: 'Necessário' }],
                            })(
                              <InputNumber
                                placeholder="Ano"
                                style={{ width: '100%' }}
                                size={4}
                                min={1900}
                                max={2000}
                                onChange={(value) => this.birthCalculed(value, 'year')}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ paddingRight: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('gender', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Select
                                placeholder="Sou do Sexo"
                                style={{ width: '100%' }}
                                onChange={(value) => this.setState({ gender: value })}>
                                <Select.Option value="female">Feminino</Select.Option>
                                <Select.Option value="male">Masculino</Select.Option>
                                <Select.Option value="other">Outro</Select.Option>
                              </Select>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ paddingLeft: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('mobileNumber', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Input
                                type="text"
                                placeholder="DDD + Telefone Celular"
                                onChange={(e) => this.setState({ mobileNumber: e.target.value })}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ paddingRight: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('password', {
                              rules: [{ required: true, message: 'Este campo é necessário' }],
                            })(
                              <Input.Password
                                type="Password"
                                placeholder="Digite sua Senha"
                                onChange={(e) => this.setState({ password: e.target.value })}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12} style={{ paddingLeft: '5px' }}>
                          <Form.Item>
                            {getFieldDecorator('passwordConfirm', {
                              rules: [
                                { required: true, message: 'Este campo é necessário' },
                                {
                                  validator: this.comparePassword,
                                },
                              ],
                            })(
                              <Input.Password
                                type="Password"
                                placeholder="Confirme sua Senha"
                                onChange={(e) => this.setState({ passwordConfirm: e.target.value })}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                          <small>
                            Ao clicar em Criar conta, você concorda com nossos Termos de Uso, nossa Política de
                            Privacidade, incluindo o Uso de Cookies.
                          </small>
                        </Col>
                        <Col span={24} style={{ textAlign: 'right', marginTop: '10px' }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon="check"
                            loading={loading}
                            style={{ marginLeft: 'auto' }}>
                            Criar conta
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Widget.Body>
                )}
              </Mutation>
            </Widget>
          </Col>
        </Row>
      </Body>,
      <Footer key="f" />,
    ];
  }
}

export default withApollo(Form.create({ name: 'formSignUp' })(formSignUp));
