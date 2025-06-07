import { Layout, Menu } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import logo from '@assets/images/logox.webp'
import styles from './styles.module.scss'
import MyHeader from '@components/Layout/Header'
import SideBar from '@components/Layout/SideBar'

const { Header, Sider, Content } = Layout
const MainLayout = () => {
  const { container, logoImg, hide, content, header } = styles
  return (
    <>
      <Layout className={container}>
        <SideBar />
        <Layout>
          <Header className={header}>
            <MyHeader />
          </Header>
          <Content style={{ padding: '10px', background: 'white' }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default MainLayout
