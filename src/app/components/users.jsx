import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { paginate } from "../utils/paginate";
import Pagination from "./pagination";
import User from "./user";
import GroupList from "./groupList";
import api from "../api";
import SearchStatus from "./searchStatus";

const Users = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [allUsers, setAllUsers] = useState();
    const [professions, setProfession] = useState();
    const [selectedProf, setSelectedProf] = useState();
    const pageSize = 4;

    useEffect(() => {
        Promise.all([
            api.professions.fetchAll(),
            api.users.fetchAll()
        ]).then(respone => {
            const [allProfessions, users] = respone;
            setProfession(allProfessions);
            setAllUsers(users);
        });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf]);

    const handleProfessionSelect = (item) => {
        setSelectedProf(item);
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const filterUsers = selectedProf
        ? allUsers.filter(user => JSON.stringify(user.profession) === JSON.stringify(selectedProf))
        : allUsers;

    const count = filterUsers ? filterUsers.length : 0;
    const usersCrop = paginate(filterUsers, currentPage, pageSize);

    const clearFilter = () => {
        setSelectedProf();
    };

    return (
        <div className="d-flex justify-content-center">
            {professions && (
                <div className="d-flex flex-column flex-shrin-0 p-3 me-2">
                    <GroupList
                        selectedItem={selectedProf}
                        items={professions}
                        onItemSelect={handleProfessionSelect}
                    />
                    <button className="btn btn-secondary mt-2" onClick={clearFilter}>Очистить</button>
                </div>
            )}
            <div className="d-flex flex-column">
                <SearchStatus length={count} />
                {count > 0 && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Имя</th>
                                <th scope="col">Качества</th>
                                <th scope="col">Провфессия</th>
                                <th scope="col">Встретился, раз</th>
                                <th scope="col">Оценка</th>
                                <th scope="col">Избранное</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {usersCrop.map((user) => (
                                <User {...props} {...user} key={user._id} />
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="d-flex justify-content-center">
                    <Pagination
                        itemsCount={count}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};
Users.propTypes = {
    allUsers: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default Users;
