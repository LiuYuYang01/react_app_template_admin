import { useState } from 'react';
import { Layout, Menu, Button, message, Modal, Drawer, Tooltip } from 'antd';
import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AimOutlined,
  HourglassOutlined,
  TruckOutlined,
  TagsOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons';
import { IoMdExit } from 'react-icons/io';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { useUserStore, useTabsStore } from '@/stores';
import PageTab from '@/components/PageTab';
import './index.scss';

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userStore = useUserStore();
  const tabsStore = useTabsStore();

  const handleLogout = async () => {
    Modal.confirm({
      title: '退出登录',
      content: '您确定要退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          userStore.quitLogin();
          message.success('已退出登录');
          navigate('/login');
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const menuItems = [
    {
      key: '/home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/pixel',
      icon: <AimOutlined />,
      label: '像素追踪',
    },
    {
      key: 'checkout-group',
      icon: <HourglassOutlined />,
      label: '结账设置',
      children: [
        {
          key: '/checkout',
          icon: <HourglassOutlined />,
          label: '转化漏斗',
        },
        {
          key: '/market_area',
          icon: <CodeSandboxOutlined />,
          label: '市场区域',
        },
        {
          key: '/shipping',
          icon: <TruckOutlined />,
          label: '运费规则',
        },
      ],
    },
    {
      key: '/order',
      icon: <TagsOutlined />,
      label: '订单列表',
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider
        width={240}
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="!bg-[#111828] hidden sm:block"
        breakpoint="sm"
        collapsedWidth={0}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['checkout-group']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            // 更新标签页状态
            tabsStore.setActiveTab(key);
          }}
          className="h-[calc(100vh-70px)] !bg-[#111828] border-r border-[#e0e0e0] !px-2.5 !rounded-xl"
        />
      </Sider>

      <Layout className="!bg-[#EAEDF1]">
        {/* 桌面端头部 */}
        <div className="flex !pl-4 !pr-4 !bg-[#fff] items-center justify-between box-shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
          <div className="flex h-full items-center gap-4 mr-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>

          <div className="flex items-center flex-1 min-w-0 h-12 overflow-x-auto">
            <div className="hidden sm:block h-full">
              <PageTab />
            </div>
          </div>

          <Tooltip title="退出登录" className="ml-4">
            <Button
              // size="large"
              type="text"
              icon={<IoMdExit className="text-xl relative top-0.5" />}
              onClick={handleLogout}
            />
          </Tooltip>
        </div>

        {/* <PageTab /> */}

        <Content className="m-2 sm:m-6 rounded-xs min-h-[280px]">
          <Outlet />
        </Content>
      </Layout>

      {/* 移动端抽屉菜单 */}
      <Drawer
        title="菜单"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={240}
        className="sm:hidden"
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['checkout-group']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            // 更新标签页状态
            tabsStore.setActiveTab(key);
            // 关闭移动端菜单
            setMobileMenuOpen(false);
          }}
          className="h-[calc(100vh-70px)] !bg-[#111828] border-r border-[#e0e0e0] !px-2.5 !rounded-xl"
        />
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
