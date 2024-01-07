import React from 'react'

import Nav from "../template/Navbar";
import {Routes} from "react-router";
import {Route} from "react-router-dom";
import Main from "../Main";
import WatchNotice from "../pages/notice/WatchNotice";
import WatchClass from "../pages/myService/WatchClass";
import TimeTable from "../pages/myService/TimeTable";
import GetStudentGrade from "../pages/grade/GetStudentGrade";

import WritePost2 from "../pages/post/WritePost2";
import WatchHoldingClass from "../pages/myService/WatchHoldingClass";
import WriteNotice from "../pages/notice/WriteNotice";
import WatchNoticeDetails from "../pages/notice/WatchNoticeDetails";
import WatchClassDetails from "../pages/classBoard/WatchClassDetails";
import ModifyNotice from "../pages/notice/ModifyNotice";
import ApplyLecture from "../pages/lecture/ApplyLecture";
import AcceptLecture from "../pages/lecture/AcceptLecture";
import RegistrationForm from "../pages/myService/RegistrationForm";
import GetProfessorGrade from "../pages/grade/GetProfessorGrade";
import Application from "../pages/application/Application";
import Accept from "../pages/application/Accept";
import WatchPost from "../pages/post/WatchPost";

function MainRouter({ Toggle,Role }) {
    return (
        <div className='px-3' >
            <Nav Toggle={Toggle}  />
                <Routes>
                    <Route path="/" element={<Main />}/>
                    {Role = "STUDENT" && <Route path="/student/*" >
                        <Route path="myService/*">
                            <Route path="myLecture" element={<WatchClass />} />
                            <Route path="mySchedule" element={<TimeTable />} />
                            <Route path="myLecture/watchClass/:classId" element={<WatchClassDetails/>}/>
                            <Route path="myHoldingLecture" element={<WatchHoldingClass />} />
                        </Route>
                        <Route path="post" element={<WatchPost />}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="application" element={<Application />}/>
                        <Route path="grade" element={<GetStudentGrade />} />
                    </Route>
                    }
                    {Role = "PROFESSOR" && <Route path="/professor/*" >
                        <Route path="myService/*">
                            <Route path="myLecture/*" element={<WatchClass />}/>
                            <Route path="myLecture/watchClass/:classId" element={<WatchClassDetails />}/>
                            <Route path="mySchedule" element={<TimeTable />} />
                            <Route path="registration" element={<RegistrationForm />} />
                            <Route path="myHoldingLecture" element={<WatchHoldingClass />} />
                        </Route>
                        <Route path="post" element={<WatchPost />}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="notice/watchNotice/:noticeId" element={<WatchNoticeDetails/>} />
                        <Route path="accept" element={<Accept />}/>
                        <Route path="grade/:type" element={<GetProfessorGrade />}/>
                    </Route>
                    }
                    {Role = "ADMIN" && <Route path="/admin/*" >
                        <Route path="lecture" element={<AcceptLecture/>}/>
                        <Route path="post" element={<WatchPost />}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />}/>
                        <Route path="notice/watchNotice/:noticeId" element={<WatchNoticeDetails/>} />
                        <Route path="notice/writeNotice" element={<WriteNotice />} />
                        <Route path="notice/modifyNotice/:noticeId" element={<ModifyNotice />} />
                    </Route>
                    }
                </Routes>
        </div>
    );
}

export default MainRouter;