import React, {useState} from 'react';
import Modal from "react-modal";
import {api} from "../../api/Api";
import {useRecoilValue} from "recoil";
import {idAtom} from "../../atom/LoginAtom";
import {useParams} from "react-router";

const FileUploadModal = ({ isOpen, files, setFiles, onRequestClose}) => {
    const {noticeId} = useParams();
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e?.target?.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택하세요.");
            return;
        }

        const formData = new FormData();
        console.log(file)
        formData.append('file', file);
        formData.append('fileName', file.name);
        formData.append('noticeId', noticeId)

        try {
            const response = await api('/api/v1/notices/uploadNoticeFile', 'POST', formData);

            if (response.code === "OK") {
                console.log(response);
                setFiles((currentFiles) => [...currentFiles, response.data]);
                alert("성공");
            } else {
                alert("실패");
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
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
                    {file && file.name}
                </a>
            ))}

                <div>
                    첨부 파일: { files && files.length > 0 && files.map(file =>
                    <a
                        href={`/download/file?fileName=${encodeURIComponent(file)}`}
                        target="_blank">{file}</a>
                )}
                </div>
            </div>
            <form encType="multipart/form-data">
                <div className="d-flex justify-content-between">
                    <input type="file" name="file" onChange={(e)=>handleFileChange(e)} />
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


