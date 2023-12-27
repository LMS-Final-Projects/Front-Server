import React from 'react'

import Nav from "../template/Navbar";
import {Router, Routes} from "react-router";
import {Route} from "react-router-dom";
import Main from "../Main";
import GetProfessorGrade from "../pages/grade/GetProfessorGrade";
import Application from "../pages/application/Application";
import Accept from "../pages/application/Accept";

function MainRouter({ Toggle,Role }) {
    return (
        <div className='px-3' >
            <Nav Toggle={Toggle} />
                <Routes>
                    <Route path="/" element={<Main />}/>
                    <Route path="/grade/:type" element={<GetProfessorGrade />}/>
                    <Route path="/application" element={<Application />}/>
                    <Route path="/accept" element={<Accept />}/>
                </Routes>
        </div>
    );
}

export default MainRouter;