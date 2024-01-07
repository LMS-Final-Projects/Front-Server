import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import MainRouter from "../routes/MainRouter";
import {useRecoilState} from "recoil";
import {emailAtom, idAtom, nameAtom, roleAtom} from "../atom/LoginAtom";
import {api, exceptionApi} from "../api/Api";

const Template = () => {

    const [toggle, setToggle] = useState(true);
    const [id, setId] = useRecoilState(idAtom);
    const [role, setRole] = useRecoilState(roleAtom);
    const [name, setName]  = useRecoilState(nameAtom);
    const [email, setEmail]  = useRecoilState(emailAtom);
    const Toggle = () => {
        console.log("변경");
        setToggle(!toggle);
    };

    const get = async () => {
        try {
            const response = await exceptionApi("/api/v1/member/info", "POST");
            setId(response.data.id);
            setRole(response.data.role);
            setName(response.data.name);
            console.log(response);
            console.log(id);
            console.log(role);
            if (role === "STUDENT"){
                const response1 = await api(`/api/v1/student/${id}`, `GET`);
                console.log(response1);
                setEmail(response1.data.email);
            }
            else if (role === 'PROFESSOR'){
                const response2 = await api(`/api/v1/professor/info/${id}`, `GET`);
                console.log(response2);
                setEmail(response2.data.email);
            }

        } catch (error) {
            alert("로그인 정보 오류!")
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        get();
    }, [toggle]);

    return (
        <>
            <div className='container-fluid bg-primary min-vh-100'>
                <div className='row'>
                    {toggle && (
                        <div className='col-4 col-md-2 bg-white vh-100 position-fixed'>
                            <Sidebar Role={role}/>
                        </div>
                    )}
                    {toggle && <div className='col-4 col-md-2'></div>}
                    <div className='col'>
                        <MainRouter Toggle={Toggle} Role={role}/>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Template;