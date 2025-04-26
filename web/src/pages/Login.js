import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import fileService from '../api/fileService';

const Login = ({closecb}) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fileService.login(values);
      localStorage.setItem('token', response.data.token);
      message.success('登录成功');
      closecb("dashboard");
    } catch (error) {
      message.error('登录失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="用户登录" style={{ width: 400, margin: '100px auto' }}>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>

      <div style={{ borderTop: '1px solid #eee', textAlign: 'center', padding: '20px 0 0 0' }}>
        <p>还没有账户 ? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => { closecb("register"); }}>创建一个新账户</span></p>
      </div>

    </Card>
  );
};

export default Login;