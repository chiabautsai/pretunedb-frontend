import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import TimeDisplay from './TimeDisplay';

const RecordsList = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('-time'); // Default sort by time in ascending order

  const { apiUrlBase:API_URL_BASE } = useContext(ApiContext);
  const API_URL = `${API_URL_BASE}/records`;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    let url = new URL(API_URL);

    // Apply search and sort conditions to the URL
    if (search) {
      url.searchParams.append('search', search);
    }
    if (sortBy) {
      url.searchParams.append('sortBy', sortBy);
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not 200');
        }
        return response.json();
      })
      .then((r) => {console.log(r); return r;})
      .then((data) => setRecords(data))
      .catch((error) => console.error('Error fetching records:', error));
  }, [search, sortBy, API_URL, token]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };


  return (
    <div>
      <h2>Records List</h2>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" id="search" value={search} onChange={handleSearchChange} />
      </div>
      <div>
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="time">Time (Ascending)</option>
          <option value="-time">Time (Descending)</option>
          <option value="preName">Pre Name (Ascending)</option>
          <option value="-preName">Pre Name (Descending)</option>
          <option value="a_id">A ID (Ascending)</option>
          <option value="-a_id">A ID (Descending)</option>
          <option value="thread_id">Thread ID (Ascending)</option>
          <option value="-thread_id">Thread ID (Descending)</option>
          <option value="post_id">Post ID (Ascending)</option>
          <option value="-post_id">Post ID (Descending)</option>
        </select>
      </div>

      {/* Records table */}
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Pre Name</th>
            <th>A ID</th>
            <th>Thread ID</th>
            <th>Post ID</th>
            <th>Click Count</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <TimeDisplay time={record.time} />
              </td>
              <td>
                <Link to={`/records/${record.id}`}>{record.preName}</Link>
              </td>
              <td>{record.a_id}</td>
              <td>{record.thread_id}</td>
              <td>{record.post_id}</td>
              <td>{record.clickCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsList;