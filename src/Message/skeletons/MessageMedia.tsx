// MessageMedia.tsx
import React from 'react';
import {
  DownloadOutlined,
  LeftOutlined,
  RightOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space } from 'antd';

interface Props {
  fileUrl: string;
}

const MessageMedia: React.FC<Props> = ({ fileUrl }) => {
  const isImage = fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  const isDocument = fileUrl.match(/\.(pdf|docx?|xlsx?|pptx?)$/i);
  const filename = fileUrl.split('/').pop();

  const imageList = [fileUrl]; // Can be extended to multiple images in the future
  const [current, setCurrent] = React.useState(0);

  const onDownload = () => {
    const url = imageList[current];
    const suffix = url.slice(url.lastIndexOf('.'));
    const filename = Date.now() + suffix;

    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(blobUrl);
        link.remove();
      });
  };

  if (isImage) {
    return (
      <Image.PreviewGroup
        preview={{
          toolbarRender: (
            _,
            {
              transform: { scale },
              actions: {
                onActive,
                onFlipY,
                onFlipX,
                onRotateLeft,
                onRotateRight,
                onZoomOut,
                onZoomIn,
                onReset,
              },
            }
          ) => (
            <Space size={12} className="toolbar-wrapper">
              <LeftOutlined onClick={() => onActive?.(-1)} />
              <RightOutlined onClick={() => onActive?.(1)} />
              <DownloadOutlined onClick={onDownload} />
              <SwapOutlined rotate={90} onClick={onFlipY} />
              <SwapOutlined onClick={onFlipX} />
              <RotateLeftOutlined onClick={onRotateLeft} />
              <RotateRightOutlined onClick={onRotateRight} />
              <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
              <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
              <UndoOutlined onClick={onReset} />
            </Space>
          ),
          onChange: (index) => setCurrent(index),
        }}
      >
        {imageList.map((url) => (
          <Image key={url} src={url} width={200} />
        ))}
      </Image.PreviewGroup>
    );
  }

 if (isDocument) {
  const isPDF = fileUrl.match(/\.pdf$/i);
  const viewerUrl = isPDF
    ? `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`
    : undefined;

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{filename}</span>
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm underline"
        >
          Download
        </a>
      </div>

      {isPDF ? (
        <iframe
          src={viewerUrl}
          title="PDF Preview"
          width="100%"
          height="500px"
          style={{ border: "1px solid #ccc", borderRadius: 6 }}
        />
      ) : (
        <div className="text-sm text-gray-500">Document preview not supported</div>
      )}
    </div>
  );
}



  return null;
};

export default MessageMedia;
