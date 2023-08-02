import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import ClickCountGraph from './ClickCountGraph';
import TimeDisplay from './TimeDisplay';

const ClicksList = ( { excludedProperties = [] } ) => {
  const [clicks, setClicks] = useState([]);
  const [sortBy, setSortBy] = useState('-time'); // Default sort by time in descending order

  const { apiUrlBase:API_URL_BASE } = useContext(ApiContext);
  const API_URL = `${API_URL_BASE}/clicks`;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    let url = new URL(API_URL);

    // Apply sort condition to the URL
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
      .then((data) => setClicks(data))
      .catch((error) => console.error('Error fetching clicks:', error));
  }, [sortBy, API_URL, token]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div>
      <ClickCountGraph />
      <h2>Clicks List</h2>
      <div>
        <label htmlFor="sort">Sort By:</label>
        <select id="sort" value={sortBy} onChange={handleSortChange}>
          <option value="-time">Time (Descending)</option>
          <option value="time">Time (Ascending)</option>
          <option value="sourceIP">Source IP (Ascending)</option>
          <option value="-sourceIP">Source IP (Descending)</option>
          <option value="linkClicked">Link Clicked (Ascending)</option>
          <option value="-linkClicked">Link Clicked (Descending)</option>
          <option value="preName">Pre Name (Ascending)</option>
          <option value="-preName">Pre Name (Descending)</option>
        </select>
      </div>

      {/* Clicks table */}
      {clicks.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(clicks[0]).map((property) => {
                if (!excludedProperties.includes(property)) {
                  return <th key={property}>{property}</th>;
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {clicks.map((click) => (
              <tr key={click.id}>
                {Object.keys(click).map((property) => {
                  if (!excludedProperties.includes(property)) {
                    return (
                      <td key={property}>
                        {property === "time" ? (
                          <TimeDisplay time={click.time} />
                        ) : (
                          <>{click[property]}</>
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

export default ClicksList;