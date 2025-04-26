import { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import FileList from '../components/FileList';
import fileService from '../api/fileService';

const TypeFiles = ({filetype}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fileService.listTypeFiles(filetype);
      setFiles(response.data.files);
    } catch (error) {
      message.error('获取文件列表失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <FileList files={files} loading={loading} refresh={(dir) => {}} />
    </div>
  );
};

export default TypeFiles;