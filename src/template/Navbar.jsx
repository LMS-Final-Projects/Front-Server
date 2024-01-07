import React from 'react'

import 'bootstrap/js/dist/dropdown'

import 'bootstrap/js/dist/collapse'
import {Link} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {nameAtom} from "../atom/LoginAtom";

function Nav({Toggle}) {

    const name = useRecoilValue(nameAtom);



    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-transparent">
            <i className="navbar-brand bi bi-justify-left fs-4" onClick={Toggle}></i>
            <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId" aria-expanded="false"
                    aria-label="Toggle navigation"><i className='bi bi-justify'></i>
            </button>
            <div className="collapse navbar-collapse" id="collapsibleNavId">
                <ul className="navbar-nav ms-auto mt-2 mt-lg-0" >
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle text-white"
                            href="#"
                            id="dropdownId"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            {name}
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownId">
                            <Link className="dropdown-item" to="/profile">
                                마이 페이지
                            </Link>
                            <Link className="dropdown-item" to="/login">
                                로그아웃
                            </Link>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Nav