import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import MainRouter from "../routes/MainRouter";
import {useRecoilState} from "recoil";
import {emailAtom, idAtom, nameAtom, roleAtom} from "../atom/LoginAtom";
import {exceptionApi} from "../api/Api";

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
            setName(response.data.name)
            setEmail(response.data.email);
            console.log(response);
            console.log(response.data.id);
            console.log(response.data.role);
            console.log(response.data.name);

        } catch (error) {
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