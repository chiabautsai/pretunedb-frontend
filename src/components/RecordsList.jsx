import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import TimeDisplay from './TimeDisplay';

const RecordsList = ({ excludedProperties = [] }) => {
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
      // .then((r) => {console.log(r); return r;})
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
      </select>
    </div>

    {/* Records table */}
    {records.length > 0 ? (
      <table>
        <thead>
        <tr>
            {Object.keys(records[0]).map((property) => {
              if (!excludedProperties.includes(property)) {
                return <th key={property}>{property}</th>;
              }
              return null;
            })}
          </tr>
        </thead>
        <tbody>
        {records.map((record) => (
            <tr key={record.id}>
              {Object.keys(record).map((property) => {
                if (!excludedProperties.includes(property)) {
                  return (
                    <td key={property}>
                      {property === "time" ? (
                        <TimeDisplay time={record.time} />
                      ) : (
                        <Link to={`/records/${record.id}`}>{record[property]}</Link>
                      )}
                    </td>
                  );
                }
                return null;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No records found.</p>
    )}
  </div>
);
};

export default RecordsList;