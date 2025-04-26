import React from 'react'
import ReactPlayer from 'react-player'
import { Modal } from 'antd';


const Player = ({ isOpen, width, height, src, closecb}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-1 w-fit" >

      <div>
        <div className="absolute top-2 left-2">视频预览</div>
        <button
          onClick={closecb}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        </div>
        
        <div className="mt-8">
        <ReactPlayer url={src}  controls={true} playing={true} width={width} />
        </div>

      </div>
    </div>
  );

}

export default Player;