import React, { useState, useEffect } from 'react'
import { Table, Button, Tag, Space, message, Card } from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useWindowSize } from 'react-use';

import Player from './Player';
import fileService from '../api/fileService';

const FileList = ({ files, loading, refresh }) => {

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [playerIsOpen, openPlayerDialog] = useState(false)
  const [playersrc, setPlayersrc] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  const handleDownload = async (filename, relpath, isPublic) => {
    try {
      let response;
      if (isPublic) {
        response = await fileService.downloadPublicFile(relpath);
      } else {
        response = await fileService.downloadFile(relpath);
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('下载失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'Filename',
      key: 'Filename',
      render: (_, record) => {
        if (!record.IsDir) {
          const ext = record.Filename.substring(record.Filename.lastIndexOf('.') + 1).toLowerCase();
          if (ext == "mp4" || ext == "flv" || ext == "mov") {
            return (
              <span
                className='cursor-pointer'
                onClick={() => { setPlayersrc(`/api/download?relpath=${record.RelPath}&token=${token}`); openPlayerDialog(true); }}
              >
                {record.Filename}
              </span>
            );
          }
          return (<span>{record.Filename}</span>)
        }
        else {
          return (
            <span
              className='cursor-pointer'
              onClick={() => { refresh(record.RelPath); }}
            >
              {record.Filename}
            </span>
          )
        }
      }
    },
    {
      title: '大小',
      dataIndex: 'Size',
      key: 'Size',
      render: Size => `${(Size / 1024).toFixed(2)} KB`,
    },
    {
      title: '状态',
      dataIndex: 'IsPublic',
      key: 'IsPublic',
      render: IsPublic => (
        <Tag color={IsPublic ? 'green' : 'orange'}>
          {IsPublic ? '公开' : '私有'}
        </Tag>
      ),
    },
    {
      title: '时间',
      dataIndex: 'UpdatedAt',
      key: 'UpdatedAt',
      render: UpdatedAt => `${new Date(UpdatedAt).toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.Filename, record.RelPath, record.IsPublic)}
          >
            下载
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const columnsMobile = [
    {
      title: '文件名',
      dataIndex: 'Filename',
      key: 'Filename',
      render: (_, record) => {
        if (!record.IsDir) {
          const ext = record.Filename.substring(record.Filename.lastIndexOf('.') + 1).toLowerCase();
          if (ext == "mp4" || ext == "flv" || ext == "mov") {
            return (
              <span
                className='cursor-pointer'
                onClick={() => { setPlayersrc(`/api/download?relpath=${record.RelPath}&token=${token}`); openPlayerDialog(true); }}
              >
                {record.Filename}
              </span>
            );
          }
          return (<span>{record.Filename}</span>)
        }
        else {
          return (
            <span
              className='cursor-pointer'
              onClick={() => { refresh(record.RelPath); }}
            >
              {record.Filename}
            </span>
          )
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.Filename, record.RelPath, record.IsPublic)}
          >
            下载
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Player isOpen={playerIsOpen} width={isMobile ? "100%" : "640px"} src={playersrc} closecb={() => openPlayerDialog(false)} />

      <Table
        columns={isMobile ? columnsMobile : columns}
        dataSource={files}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

    </>
  );
};

export default FileList;