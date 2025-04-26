import React, { useState } from "react";
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import fileService from '../api/fileService';
import * as store from '../api/store'

const FileUpload = ({ rootDir, onUploadSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
      formData.append('rootdir', rootDir); 
      formData.append("currentdir", store.getCurrentDir())
    });

    setUploading(true);
    try {
      await fileService.uploadFile(formData);
      message.success('上传成功');
      setFileList([]);
      onUploadSuccess && onUploadSuccess();
    } catch (error) {
      message.error('上传失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: file => {
      setFileList(prev => prev.filter(f => f.uid !== file.uid));
    },
    beforeUpload: file => {
      setFileList(prev => [...prev, file]);
      return false; // 阻止自动上传
    },
    fileList,
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? '上传中...' : '开始上传'}
      </Button>
    </div>
  );
};

export default FileUpload;