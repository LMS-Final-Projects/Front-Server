import React from 'react'

import Nav from "../template/Navbar";
import {Routes} from "react-router";
import {Route} from "react-router-dom";
import Main from "../Main";
import WatchNotice from "../pages/notice/WatchNotice";
import WatchClass from "../pages/myService/WatchClass";
import TimeTable from "../pages/myService/TimeTable";
import GetStudentGrade from "../pages/grade/GetStudentGrade";
import WatchPost from "../pages/post/WatchPost";
import WritePost2 from "../pages/post/WritePost2";
import WatchHoldingClass from "../pages/myService/WatchHoldingClass";
import WriteNotice from "../pages/notice/WriteNotice";
import WatchNoticeDetails from "../pages/notice/WatchNoticeDetails";
import WatchClassDetails from "../pages/classBoard/WatchClassDetails";
import ModifyNotice from "../pages/notice/ModifyNotice";
import ApplyLecture from "../pages/lecture/ApplyLecture";
import AcceptLecture from "../pages/lecture/AcceptLecture";
import RegistrationForm from "../pages/myService/RegistrationForm";

function MainRouter({ Toggle,Role }) {
    return (
        <div className='px-3' >
            <Nav Toggle={Toggle} />
                <Routes>
                    <Route path="/" element={<Main />}/>
                    {Role = "STUDENT" && <Route path="/student/*" >
                        <Route path="myService/*">
                            <Route path="myLecture" element={<WatchClass />} />
                            <Route path="mySchedule" element={<TimeTable />} />
                            <Route path="myLecture/watchClass/:classId" element={<WatchClassDetails />}/>
                            <Route path="myHoldingLecture" element={<WatchHoldingClass />} />
                        </Route>
                        <Route path="post" element={<WatchPost/>}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="grade/*">
                            <Route path="get" element={<GetStudentGrade />} />
                        </Route>
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
                        <Route path="post/*" element={<WatchPost/>}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="notice/watchNotice/:noticeId" element={<WatchNoticeDetails/>} />
                        <Route path="grade/*">
                            <Route path="get" element={<GetStudentGrade />} />
                        </Route>
                    </Route>
                    }
                    {Role = "ADMIN" && <Route path="/admin/*" >
                        <Route path="lecture" element={<AcceptLecture/>}/>
                        <Route path="post/*" element={<WatchPost/>}/>
                        <Route path="post/writePost" element={<WritePost2 />} />
                        <Route path="notice"element={<WatchNotice />}/>
                        <Route path="notice/watchNotice/:noticeId" element={<WatchNoticeDetails/>} />
                        <Route path="notice/writeNotice" element={<WriteNotice />} />
                        <Route path="notice/modifyNotice/:noticeDetails" element={<ModifyNotice />} />
                    </Route>
                    }
                </Routes>
        </div>
    );
}

export default MainRouter;