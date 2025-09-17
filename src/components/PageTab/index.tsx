import React, { useEffect, useState } from 'react';
import { Dropdown } from 'antd';
import {
  CloseOutlined,
  HomeOutlined,
  AimOutlined,
  HourglassOutlined,
  CodeSandboxOutlined,
  TruckOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router';
import { useTabsStore } from '@/stores';

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeTabKey, addTab, removeTab, setActiveTab, clearTabs } = useTabsStore();
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  // 页面标题和图标映射
  const pageConfigMap: Record<string, { title: string; icon: React.ReactNode }> = {
    '/home': { title: '首页', icon: <HomeOutlined /> },
    '/pixel': { title: '像素追踪', icon: <AimOutlined /> },
    '/checkout': { title: '转化漏斗', icon: <HourglassOutlined /> },
    '/market_area': { title: '市场区域', icon: <CodeSandboxOutlined /> },
    '/shipping': { title: '运费规则', icon: <TruckOutlined /> },
    '/order': { title: '订单列表', icon: <TagsOutlined /> },
  };

  // 当路由变化时，自动添加标签
  useEffect(() => {
    const currentPath = location.pathname;
    const config = pageConfigMap[currentPath] || { title: '未知页面', icon: null };

    if (currentPath !== '/home') {
      addTab({
        key: currentPath,
        title: config.title,
        path: currentPath,
      });
    }
  }, [location.pathname, addTab]);

  // 检查滚动状态
  const checkScrollStatus = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setShowScrollLeft(scrollLeft > 0);
      setShowScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  // 滚动到指定位置
  const scrollTo = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const scrollAmount = 200;
      const currentScroll = tabsContainerRef.current.scrollLeft;
      const newScroll = direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount;

      tabsContainerRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  };

  // 处理标签切换
  const handleTabClick = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  // 处理标签关闭
  const handleTabClose = (key: string, e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    removeTab(key);

    // 如果关闭的是当前标签，需要导航到新的激活标签
    if (key === activeTabKey) {
      const remainingTabs = tabs.filter((tab) => tab.key !== key);
      if (remainingTabs.length > 0) {
        const nextTab = remainingTabs[remainingTabs.length - 1];
        navigate(nextTab.key);
      }
    }
  };

  // 处理右键菜单
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 关闭其他标签
  const handleCloseOthers = (key: string) => {
    const newTabs = tabs.filter((tab) => tab.key === key || !tab.closable);
    // 使用 clearTabs 然后重新设置
    clearTabs();
    newTabs.forEach((tab) => addTab(tab));
    setActiveTab(key);
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    clearTabs();
    navigate('/home');
  };

  // 渲染单个标签
  const renderTab = (tab: any) => {
    const isActive = tab.key === activeTabKey;
    const config = pageConfigMap[tab.key] || { title: tab.title, icon: null };
    const menuItems = [
      {
        key: 'close',
        label: '关闭',
        onClick: () => handleTabClose(tab.key, {} as React.MouseEvent<HTMLSpanElement>),
      },
      {
        key: 'closeOthers',
        label: '关闭其他',
        onClick: () => handleCloseOthers(tab.key),
      },
      {
        key: 'closeAll',
        label: '关闭所有',
        onClick: handleCloseAll,
      },
    ];

    return (
      <div
        key={tab.key}
        className={`
          flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 cursor-pointer 
          transition-all duration-200 whitespace-nowrap min-w-fit rounded-xs
          touch-manipulation select-none h-full
          ${
            isActive
              ? 'bg-blue-50 text-blue-600 border-b-2 border-b-blue-500'
              : 'bg-white text-gray-600 hover:bg-[#f1f7ff] hover:text-gray-800 active:bg-gray-100'
          }
        `}
        onClick={() => handleTabClick(tab.key)}
        onContextMenu={handleContextMenu}
      >
        {/* 图标 */}
        {config.icon && (
          <span className={`text-xs sm:text-sm ${isActive ? 'text-blue-600' : 'text-gray-500'} flex-shrink-0`}>
            {config.icon}
          </span>
        )}

        {/* 标题 */}
        <span className="text-xs sm:text-sm truncate max-w-[60px] sm:max-w-none">{tab.title}</span>

        {/* 关闭按钮 */}
        {tab.path !== '/home' && (
          <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']} placement="bottomRight">
            <div className="flex items-center flex-shrink-0">
              <CloseOutlined
                className="!text-[8px] sm:!text-[10px] !text-gray-300 transition-colors ml-1 p-0.5 sm:p-1 rounded-full hover:bg-red-500 hover:!text-white touch-manipulation"
                onClick={(e) => handleTabClose(tab.key, e)}
              />
            </div>
          </Dropdown>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex-1 min-w-0 h-full">
      {/* 左侧滚动按钮 */}
      {showScrollLeft && (
        <button
          className="absolute left-0 top-0 h-full w-6 sm:w-8 bg-white border-r border-gray-200 flex items-center justify-center z-10 hover:bg-gray-50 touch-manipulation"
          onClick={() => scrollTo('left')}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 标签容器 */}
      <div
        ref={tabsContainerRef}
        className="flex h-full overflow-x-auto [&::-webkit-scrollbar]:hidden"
        onScroll={checkScrollStatus}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
      >
        <div className="flex space-x-1 sm:space-x-2 px-2 sm:px-4 h-full">{tabs.map(renderTab)}</div>
      </div>

      {/* 右侧滚动按钮 */}
      {showScrollRight && (
        <button
          className="absolute right-0 top-0 h-full w-6 sm:w-8 bg-white border-l border-gray-200 flex items-center justify-center z-10 hover:bg-gray-50 touch-manipulation"
          onClick={() => scrollTo('right')}
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
