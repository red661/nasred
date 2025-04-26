import { useState, useEffect } from 'react';
import { Image } from 'antd';
import fileService from '../api/fileService';

const AuthImage = ({ width, height, src }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fileService.downloadFile(src);
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error('Failed to load protected image', error);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl); // 清理
      }
    };
  }, [src]);

  return <Image width={width} height={height} src={imageUrl} />;
};

export default AuthImage;