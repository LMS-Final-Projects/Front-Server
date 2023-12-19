import React from 'react'

import Nav from "../template/Navbar";
import {Routes} from "react-router";
import {Route} from "react-router-dom";
import Main from "../Main";
import WatchNotice from "../pages/notice/WatchNotice";
import WatchClass from "../pages/myService/WatchClass";
import TimeTable from "../pages/myService/TimeTable";
import GetStudentGrade from "../pages/grade/GetStudentGrade";
import WatchPost from "../pages/mail/WatchPost";
import WritePost from "../pages/mail/WritePost";
import WatchHoldingClass from "../pages/myService/WatchHoldingClass";
import WriteNotice from "../pages/notice/WriteNotice";
import WatchNoticeDetails from "../pages/notice/WatchNoticeDetails";
import WatchClassDetails from "../pages/classBoard/WatchClassDetails";

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
                            <Route path="myHoldingLecture" element={<WatchHoldingClass />} />
                        </Route>
                        <Route path="post/*" element={<WatchPost/>}>
                             <Route path="writePost" element={<WritePost />} />
                        </Route>
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="grade/*">
                            <Route path="get" element={<GetStudentGrade />} />
                        </Route>
                    </Route>
                    }
                    {Role = "PROFESSOR" && <Route path="/professor/*" >
                        <Route path="myService/*">
                            <Route path="myLecture/*" element={<WatchClass />}>
                                <Route path="watchClass" element={<WatchClassDetails />}/>
                            </Route>
                            <Route path="mySchedule" element={<TimeTable />} />
                            <Route path="myHoldingLecture" element={<WatchHoldingClass />} />
                        </Route>
                        <Route path="post/*" element={<WatchPost/>}>
                            <Route path="writePost" element={<WritePost />} />
                        </Route>
                        <Route path="notice"element={<WatchNotice />} />
                        <Route path="grade/*">
                            <Route path="get" element={<GetStudentGrade />} />
                        </Route>
                    </Route>
                    }
                    {Role = "ADMIN" && <Route path="/admin/*" >
                        <Route path="post/*" element={<WatchPost/>}>
                            <Route path="writePost" element={<WritePost />} />
                        </Route>
                        <Route path="notice/*"element={<WatchNotice />}>
                            <Route path="watchNotice" element={<WatchNoticeDetails/>} />
                            <Route path="writeNotice" element={<WriteNotice />} />
                        </Route>
                    </Route>
                    }
                </Routes>
        </div>
    );
}

export default MainRouter;