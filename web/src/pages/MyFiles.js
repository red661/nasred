import { useState, useEffect } from 'react';
import { message, Button } from 'antd';
import FileList from '../components/FileList';
import fileService from '../api/fileService';
import Uploader from './Uploader';
import Mkdir from './Mkdir'
import * as store from '../api/store'

const MyFiles = ({rootDir}) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploaderIsOpen, openUploaderDialog] = useState(false)
  const [mkdirIsOpen, openMkdirDialog] = useState(false)
  const [curDir, setCurDir] = useState("");

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let response;
      if (rootDir === "public")
        response = await fileService.listPublicFiles(curDir);
      else
        response = await fileService.listFiles(curDir);
      setFiles(response.data.files);
    } catch (error) {
      message.error('获取文件列表失败: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [curDir]);

  useEffect(() => {
    store.setCurrentDir("");
  }, []);

  return (
    <div>
      <Uploader isOpen={uploaderIsOpen} rootDir={rootDir} closecb={(b) => { openUploaderDialog(false); if (b) fetchFiles(); }} />
      <Mkdir isOpen={mkdirIsOpen} rootDir={rootDir} curDir={curDir} closecb={(b) => { openMkdirDialog(false); if (b) fetchFiles(); }} />

      <div className='pt-3 pl-3 pb-3'>
        <Button className='mr-3' onClick={() => openUploaderDialog(true)}>上传文件</Button>
        <Button onClick={() => openMkdirDialog(true)}>创建文件夹</Button>
      </div>
      <FileList files={files} loading={loading} refresh={(dir) => {setCurDir(dir); store.setCurrentDir(dir); }} />
    </div>
  );
};

export default MyFiles;