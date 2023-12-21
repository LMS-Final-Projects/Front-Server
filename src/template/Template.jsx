import React, {useEffect, useState} from 'react';
import Sidebar from "./Sidebar";
import MainRouter from "../routes/MainRouter";
import {useRecoilState} from "recoil";
import {idAtom, roleAtom} from "../atom/LoginAtom";
import {exceptionApi} from "../api/Api";

const Template = () => {

    const [toggle, setToggle] = useState(true);
    const [id, setId] = useRecoilState(idAtom);
    const [role, setRole] = useRecoilState(roleAtom);

    const Toggle = () => {
        console.log("변경");
        setToggle(!toggle);
    };

    const get = async () => {
        try {
            // const response = await exceptionApi("/api/v1/member/info", "POST");
            // setId(response.data.id);
            // setRole(response.data.role);
            // console.log(response);
            // console.log(response.data.id);
            // console.log(response.data.role);
            setId("5fc2b170-3901-4891-a9cf-ca47f0efcbe4");
            setRole("ADMIN");

        } catch (error) {
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        get();
    }, []);

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