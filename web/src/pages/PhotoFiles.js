import { useState, useEffect } from 'react';
import { message, Button, Image } from 'antd';
import fileService from '../api/fileService';
import AuthImage from '../components/AuthImage';
import { useWindowSize } from 'react-use';

const PhotoFiles = () => {

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fileService.listTypeFiles("photo");
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
    <div className='w-full'>
      <Image.PreviewGroup
        preview={{
          onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
        }}
      >

        <div className='flex flex-wrap'>
          {files.map((item, index) => (
            <div className="mt-5 ml-5" key={index} >
              <AuthImage width={isMobile ? 80 : 200} height={isMobile ? 80 : 200} src={item.RelPath} />
            </div>
          ))}
        </div>

      </Image.PreviewGroup>

    </div>
  );
};

export default PhotoFiles;