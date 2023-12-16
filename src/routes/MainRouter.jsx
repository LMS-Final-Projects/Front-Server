import React from 'react'

import Nav from "../template/Navbar";
import {Router, Routes} from "react-router";
import {Route} from "react-router-dom";
import Main from "../Main";
import GetProfessorGrade from "../pages/grade/GetProfessorGrade";

function MainRouter({ Toggle,Role }) {
    return (
        <div className='px-3' >
            <Nav Toggle={Toggle} />
                <Routes>
                    <Route path="/" element={<Main />}/>
                    <Route path="/grade/:type" element={<GetProfessorGrade />}/>
                </Routes>
        </div>
    );
}

export default MainRouter;