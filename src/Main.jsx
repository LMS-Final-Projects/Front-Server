import React from 'react';

const Main = () => {
    return (
        <div>
            <div className="bg-white rounded mt-4 p-4">
                <h4 className="bg-dark text-white p-2 mb-4">메인화면 테스트</h4>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Main;