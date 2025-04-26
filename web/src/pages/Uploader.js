import {  Modal } from 'antd';
import FileUpload from '../components/FileUpload';

const Uploader = ({ isOpen, closecb, rootDir }) => {

  const handleCancel = () => {
    closecb(false);
  };

  return (
    <>
      <Modal
        title="上传文件"
        footer={null}
        open={isOpen}
        onCancel={handleCancel}
      >
        <div>
          <FileUpload rootDir={rootDir} onUploadSuccess={() => closecb(true)} />
        </div>

      </Modal>
    </>
  );
};

export default Uploader;