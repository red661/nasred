import './App.css'

import { useState, useEffect, Component } from 'react';
import { Layout, message, Drawer } from 'antd';
import { AiOutlineMenu, AiOutlineUser, AiOutlineUsergroupAdd, AiOutlineFire } from 'react-icons/ai'

import fileService from './api/fileService';
import Dashboard from './pages/Dashboard';
import MyFiles from './pages/MyFiles';
import TypeFiles from './pages/TypeFiles';
import PhotoFiles from './pages/PhotoFiles';
import Login from './pages/Login';
import Register from './pages/Register';

import { useWinSize } from './components/winsize'

const { Header, Content, Sider, Footer } = Layout;

function App() {

  const [pageId, setPageId] = useState("dashboard")
  const [hasinfo, setHasinfo] = useState(false)

  const winsize = useWinSize();
  const [sidercollapsed, setSidercollapsed] = useState(false)
  const [drawopened, setDrawopened] = useState(false)

  const checkInfo = async () => {
    try {
      const response = await fileService.info();
      setHasinfo(true);
    } catch (error) {
      message.error('info error: ' + (error.response?.data?.error || error.message));
    }
  }

  useEffect(() => {
    checkInfo();
  }, [])

  useEffect(() => {
    if (winsize.width < 800) {
      setSidercollapsed(true);
    } else {
      setSidercollapsed(false);
    }
  }, [winsize])

  const leftbarContent = () => {
    return (
      <div className='pl-8 text-white text-lg'>
        <div className='pt-4 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("dashboard") }}>首页</div>

        <div className='pt-2 cursor-pointer' onClick={
          () => { setDrawopened(false); if (hasinfo) setPageId("myfiles"); else setPageId("login"); }
        }
        >我的文件</div>

        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("publicfiles") }}>公共文件</div>

        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("video") }} >视频</div>
        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("audio") }}>音乐</div>
        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("photo") }}>图片</div>
        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("doc") }}>文档</div>
        <div className='pt-2 cursor-pointer' onClick={() => { setDrawopened(false); setPageId("file") }}>其他</div>

        <div className='pt-2 cursor-pointer' onClick={() => { 
          if (hasinfo) fileService.logout();
          setDrawopened(false); 
          setPageId("login") 
        }}>{hasinfo ? "退出登陆" : "登陆"}</div>
      </div>
    )
  }

  return (
    <>

      <div className="headerbar" >
        <div style={{ fontSize: '28px', color: '#333', padding: '7px 0 0 5px' }}>
          <AiOutlineMenu onClick={() => { setDrawopened(true); }} />
        </div>
      </div>

      <Layout>

        {sidercollapsed ? (
          <Drawer
            zIndex="20000"
            style={{ overflow: 'hidden', background: '#222' }}
            bodyStyle={{ padding: 0 }}
            width="260"
            closable={false}
            placement="left"
            open={drawopened}
            onClose={() => { setDrawopened(false); }}>
            {leftbarContent()}
          </Drawer>
        ) : ''}


        <Sider
          style={{ overflow: 'hidden', height: '100vh', background: '#555' }}
          collapsed={sidercollapsed}
          width="160"
          collapsedWidth="0"
          className="leftbar"
        >
          {leftbarContent()}
        </Sider>

        <Content className='mgheader'>

          <div className={`${pageId == "dashboard" ? "show" : "hidden"}`} >
            <Dashboard />
          </div>

          {pageId == "myfiles" ? <MyFiles rootDir={""} /> : ""}
          {pageId == "publicfiles" ? <MyFiles rootDir={"public"} /> : ""}

          {pageId == "video" ? <TypeFiles filetype="video" /> : ""}
          {pageId == "audio" ? <TypeFiles filetype="audio" /> : ""}
          {pageId == "photo" ? <PhotoFiles /> : ""}
          {pageId == "doc" ? <TypeFiles filetype="doc" /> : ""}
          {pageId == "file" ? <TypeFiles filetype="file" /> : ""}


          <div className={`${pageId == "register" ? "show" : "hidden"}`} >
            <Register closecb={setPageId} />
          </div>

          <div className={`${pageId == "login" ? "show" : "hidden"}`} >
            <Login closecb={(page) => { setPageId(page); if (page == "dashboard") setHasinfo(true); }} />
          </div>

        </Content>
      </Layout>
    </>
  )
}

export default App;
