import React from 'react';
import Modal from "react-modal";

const FileUploadModal = ({ isOpen,onRequestClose, files, onRequestUpload, onRequestChange }) => {

    const handleFileChange = () => {
      onRequestChange();
    };

    const handleUpload = () => {
        onRequestUpload();
    };

    const closeModal = () => {
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal}>
            <h2>파일 업로드</h2>
            <div>
                첨부 파일: {files && files.length > 0 && files.map((file, index) => (
                <a key={index} href={`${file}`} target="_blank">
                    {file}
                </a>
            ))}
            </div>
            <form encType="multipart/form-data">
                <div className="d-flex justify-content-between">
                <input type="file" name="file" onChange={handleFileChange} />
                <button type="button" className="btn btn-primary" onClick={handleUpload}>
                    확인
                </button>
                </div>
            </form>
            <div className="d-flex justify-content-start">
                <button type="button" className="btn btn-primary" onClick={closeModal}>
                    닫기
                </button>
            </div>
        </Modal>
    );
};

export default FileUploadModal;
