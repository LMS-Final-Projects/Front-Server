import React, { useState } from 'react';
import { api } from '../../api/Api';
import { useRecoilValue } from 'recoil';
import { idAtom, roleAtom } from '../../atom/LoginAtom';

import FileUploadModal from "./FileUploadModal";

const WriteNotice = ({files, setFiles}) => {

    const currentDate = new Date();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [file, setFile] = useState(null);
    const id = useRecoilValue(idAtom)
    const role = useRecoilValue(roleAtom)

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        // e.preventDefault() // 기본 폼 제출 동작 방지
        const formData = new FormData();
        const adminId = id
        const adminBoardId =111
        const fileName = file.name;
        formData.append('file', file);
        formData.append('adminId',adminId)
        formData.append('adminBoardId',adminBoardId)
        formData.append('fileName',fileName)

        try {
            const response = await api('/api/v1/notices/uploadNoticeFile', 'POST',
                formData);

            if (response.code === "OK") {
                console.log(response)
                setFiles((files) => [...files, response.data]);
                alert("성공")
            } else {
                alert("실패")
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }

    };

    console.log(files)

    const [formData, setFormData] = useState({
        title: '',
        upLoadTime: currentDate,
        content: '',
        fileUrls: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const NoticeCreateRequest = {
            memberId: id,
            title: formData.title,
            content: formData.content,
            fileUrls: formData.fileUrls,
        };

        const adminResponse = await api('/api/v1/notices', 'POST', NoticeCreateRequest);
        console.log(adminResponse);

        if (adminResponse.code === 'OK') {
            alert('공지 작성 성공!');
            setFormData({
                title: '',
                content: '',
                fileUrl: '',
            });
        } else {
            alert('공지 작성 실패!');
            setFormData({
                title: '',
                content: '',
                fileUrl: '',
            });
        }
    };

    return (
        <div>
            {role === 'ADMIN' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">공지작성</div>
                    <form onSubmit={handleSubmit} className="bg-white text-dark p-3 rounded" style={{ border: '2px solid black' }}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">
                                제목:
                            </label>
                            <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="upLoadTime" className="form-label">
                                작성시간:
                            </label>
                            <input type="text" id="upLoadTime" name="upLoadTime" className="form-control" value={formData.upLoadTime} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notice" className="form-label">
                                작성자:
                            </label>
                            <input id="userName" name="userName" className="form-control" value={"관리자"} readOnly={true} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">
                                내용:
                            </label>
                            <textarea id="content" name="content" className="form-control" value={formData.content} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="fileUrl" className="form-label">
                                파일 업로드:
                            </label>
                            <input type="text" id="fileUrl" name="fileUrl" className="form-control" value={formData.fileUrl} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-between">
                            <div>
                                첨부 파일: { files && files.length > 0 && files.map(file =>
                                <a
                                    href={`/download/file?fileName=${encodeURIComponent(file)}`}
                                    target="_blank">{file}</a>
                            )}
                                <button type = "button" className="btn btn-primary" onClick={openModal}>+</button>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                보내기
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <FileUploadModal isOpen={modalIsOpen} onRequestClose={closeModal} onRequestUpload={handleUpload}>
            </FileUploadModal>
        </div>
    );
};

export default WriteNotice;
