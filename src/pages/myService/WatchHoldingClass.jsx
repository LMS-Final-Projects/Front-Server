import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { api } from "../../api/Api";
import { roleAtom } from "../../atom/LoginAtom";

function WatchHoldingClass() {
    const role = useRecoilValue(roleAtom);
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const response = await api('api/v1/manager/classes', 'GET');
                setClasses(response.data);
                console.log(response.data); // 최신 데이터를 출력
            } catch (error) {
                alert('Error fetching classes:', error);
            }
        };

        fetchClass();
    }, []);

    const handleClassDetails = async (id) => {
        try {
            const response = await api(`api/v1/classes/${id}`, 'GET');
            if (response.errorMsg === '') {
                alert('공지사항 호출 성공!');
            } else {
                alert('공지사항 호출 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error Watching WatchClass:', error);
        }
    }

    const handleCheckboxChange = (event, classObj) => {
        if (event.target.checked) {
            setSelectedClasses(prevSelected => [...prevSelected, classObj]);
            console.log(selectedClasses);
        } else {
            setSelectedClasses(prevSelected => prevSelected.filter(selectedClass => selectedClass.id !== classObj.id));
            console.log(selectedClasses);
        }
    }

    const handleDeleteSelectedClasses = async () => {
        try {
            const classIds = selectedClasses.map(selectedClass => selectedClass.id);
            // 여기에서 선택된 클래스들을 삭제하는 로직을 수행해야 합니다.
            const response = await api('api/v1/classes/delete', 'POST', { classIds });
            if (response.errorMsg === '') {
                alert('공지 삭제 성공!');
            } else {
                alert('공지 삭제 실패:', response.statusText);
            }
        } catch (error) {
            alert('Error deleting classes:', error);
        }
    };

    const handleTitleClick = async (id) => {
        try {
            navigate(`/class/watchClass/details/${id}`);
            await handleClassDetails(id);
        } catch (error) {
            console.error('Error handling title click:', error);
        }
    };

    return (
        <>
            <div>
                <div className="bg-dark text-white p-2 mb-4">
                    수강 신청 목록
                </div>
                {role ===  'PROFESSOR' && (
                    <div className="bg-white rounded mt-4 p-4">
                    </div>
                )}

                {role === 'STUDENT' && (
                    <div className="bg-white rounded mt-4 p-4">
                    </div>
                )}
                {!role && (
                    <div>유저 정보를 불러오는 중입니다...</div>
                )}
            </div>
        </>
    )
}

export default WatchHoldingClass;
