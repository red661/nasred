import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import fileService from '../api/fileService';

const Mkdir = ({ isOpen, rootDir, curDir, closecb }) => {

  const [inputValue, setInputValue] = useState('');

  const handleOk = async () => {
    try {
      await fileService.mkdir(rootDir, curDir, inputValue);
      closecb(true);
    } catch (error) {
      message.error('创建失败: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCancel = () => {
    closecb(false);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Modal title="新建文件夹" open={isOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="名称" value={inputValue} onChange={handleChange} />
      </Modal>
    </>
  );
};

export default Mkdir;