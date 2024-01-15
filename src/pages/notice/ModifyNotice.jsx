import React, {useEffect, useState} from 'react';
import { api } from '../../api/Api';
import { useRecoilValue } from 'recoil';
import {emailAtom, idAtom, nameAtom, roleAtom} from '../../atom/LoginAtom';
import FileUploadModal from "./FileUploadModal";
import {useParams} from "react-router";

const ModifyNotice = ({ files, setFiles }) => {
    const {noticeId} = useParams();
    const [noticeDetails, setNoticeDetails] = useState('');
    const currentDate = new Date();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        upLoadTime: currentDate,
        content: '',
        fileUrl: '',
    });

    const [file, setFile] = useState(null);
    const memberId = useRecoilValue(idAtom);
    const role = useRecoilValue(roleAtom);
    const email = useRecoilValue(emailAtom);
    const name = useRecoilValue(nameAtom);


    useEffect(() => {
        const fetchNoticeDetails = async () => {

            try {

                const NoticeFileRequest = {
                    memberId: memberId,
                    noticeId: noticeId,
                };

                const noticeResponse = await api(`api/v1/notices/${noticeId}`, 'GET');
                setNoticeDetails(noticeResponse.data);

                setFormData({
                    title: noticeDetails.title,
                    upLoadTime: currentDate,
                    content: noticeDetails.content,
                    fileUrl: noticeDetails.fileUrl || '',
                });

                const fileResponse = await api(`api/v1/notices/getNoticeFile`, 'POST', NoticeFileRequest);
                setFiles(fileResponse.data);

            } catch (error) {
                alert('Error fetching notice details:', error);
            }
        };

        fetchNoticeDetails();
    }, [noticeId, memberId]);

    console.log(formData);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleFileChange = (selectedFile) => {
        setFile(selectedFile);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const adminId = memberId;
        const adminBoardId = 111;
        const fileName = file.name;
        formData.append('file', file);
        formData.append('adminId', adminId);
        formData.append('adminBoardId', adminBoardId);
        formData.append('fileName', fileName);

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
    console.log(files);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const NoticeUpdateRequest = {
            memberId: memberId,
            title: formData.title,
            createAt: formData.upLoadTime,
            content: formData.content,
            fileUrl: formData.fileUrl,
            email: email
        };

        const adminResponse = await api('/api/v1/notices/info', 'POST', NoticeUpdateRequest);
        console.log(adminResponse);

        if (adminResponse.code === 'OK') {
            alert('공지 수정 성공!');
            setFormData({
                title: formData.title,
                content: formData.content,
                fileUrl: formData.fileUrl,
            });
        } else {
            alert('공지 수정 실패!');
            setFormData({
                title: formData.title,
                content: formData.content,
                fileUrl: formData.fileUrl,
            });
        }
    };

    return (
        <div>
            {role === 'ADMIN' && (
                <div>
                    <div className="bg-dark text-white p-2 mb-4">공지 수정</div>
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
                            <input id="notice" name="notice" className="form-control" value={name} readOnly={true} />
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
                                첨부 파일: {files && files.length > 0 && files.map(file =>
                                <a
                                    href={`/download/file?fileName=${encodeURIComponent(file)}`}
                                    target="_blank">{file}</a>
                            )}
                                <button type="button" className="btn btn-primary" onClick={openModal}>+</button>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                수정
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <FileUploadModal isOpen={modalIsOpen} onRequestClose={closeModal} setFiles={setFiles} onRequestChange={handleFileChange} />
        </div>
    );
};

export default ModifyNotice;
