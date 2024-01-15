import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {api} from "../../api/Api";


function TimTableDetails () {
    const { id } = useParams();
    const [timeTableDetails, setNoticeDetails] = useState('');


    useEffect(() => {
        const fetchIimeTableDetails = async () => {

            try {
                const timeTableResponse = await api(`api/v1/timeTables/getNotice/${id}`, 'GET');
                console.log(timeTableResponse.data)
                setNoticeDetails(timeTableResponse.data);
                console.log(timeTableDetails);
            } catch (error) {
                alert('Error fetching timeTable details:', error);
            }
        };

        if (!timeTableDetails) {
            fetchIimeTableDetails();
        }
    }, [id]);



    if (!timeTableDetails) {

        return <div>Loading...</div>;
    }

    return (
        <>
        </>
    );
};

export default TimTableDetails;

