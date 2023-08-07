import React, { useState, useEffect } from "react";

const rowsPerPage = 10;

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);

  const totalPages = Math.ceil(usersData.length / rowsPerPage);

  const updateTable = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const dataToDisplay = usersData.slice(startIndex, startIndex + rowsPerPage);

    return dataToDisplay.map((user) => (
      <tr key={user.id}>
        <td>
          <input type="checkbox" />
        </td>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
      </tr>
    ));
  };

  const gotoPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();
      setUsersData(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>{updateTable()}</tbody>
      </table>
      <div>
        <button onClick={() => gotoPage(currentPage - 1)}>Previous</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button
              key={page}
              onClick={() => gotoPage(page)}
              style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
            >
              {page}
            </button>
          )
        )}
        <button onClick={() => gotoPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default App;
