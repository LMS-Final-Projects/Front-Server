import React, {useState} from 'react';
import Modal from 'react-modal';
import {useRecoilValue} from "recoil";
import {idAtom, roleAtom} from "../../atom/LoginAtom";
import {api} from "../../api/Api";



const ClassFileUpload = ({files, setFiles}) => {
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
        e.preventDefault() // 기본 폼 제출 동작 방지
        const formData = new FormData();
        const memberId = id
        const classId =111
        const fileName = file.name;
        formData.append('file', file);
        formData.append('memberId',memberId)
        formData.append('classId',classId)
        formData.append('fileName',fileName)

        try {
            const response = await api('/api/v1/classes/uploadClassFile', 'POST',
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
    return (
        <div>
            <div>
                첨부 파일: { files && files.length > 0 && files.map(file =>
                <a
                    href={`/download/file?fileName=${encodeURIComponent(file)}`}
                    target="_blank">{file}</a>
            )}{ role === "PROFESSOR"  && <button type = {"button"} onClick={openModal}>+</button>}
            </div>
            <div></div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <div>
                    첨부 파일: { files && files.length > 0 && files.map(file =>
                    <a
                        href={`${file}`}

                        target="_blank">{file}</a>
                )}
                </div>
                <h2>파일 업로드</h2>
                <form encType="multipart/form-data">
                    <input type="file" name="file" onChange={handleFileChange} />
                    <button type="button" onClick={handleUpload}>
                        확인
                    </button>
                </form>
                <button type="button" onClick={closeModal}>
                    닫기
                </button>
            </Modal>
        </div>
    );
};

export default ClassFileUpload;