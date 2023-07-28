import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';
import TimeDisplay from './TimeDisplay';
import ClickCountGraph from './ClickCountGraph';

const RecordDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [record, setRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const { apiUrlBase:API_URL_BASE } = useContext(ApiContext);
  const API_URL = `${API_URL_BASE}/records/${id}`;

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setRecord(data);
        setFormData(data);
        setDownloadLinks(JSON.parse(data.downloadLinks));
      })
      .catch((error) => console.error('Error fetching record details:', error));
  }, [API_URL, token]);

  if (!record) {
    return <div>Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL_BASE}/records/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Record deletion failed');
      }

      // Redirect the user to the desired page after successful deletion
      navigate('/records'); // Update the path as needed

    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  const handleAddLink = () => {
    setDownloadLinks([...downloadLinks, '']);
  };

  const handleRemoveLink = (index) => {
    const updatedDownloadLinks = [...downloadLinks];
    updatedDownloadLinks.splice(index, 1);
    setDownloadLinks(updatedDownloadLinks);
    setFormData((prevFormData) => ({
      ...prevFormData,
      downloadLinks: updatedDownloadLinks,
    }));
  };

  const handleDownloadLinkChange = (index, value) => {
    const updatedDownloadLinks = [...downloadLinks];
    updatedDownloadLinks[index] = value;
    setDownloadLinks(updatedDownloadLinks);
    setFormData((prevFormData) => ({
      ...prevFormData,
      downloadLinks: updatedDownloadLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty downloadLinks before submitting
    const filteredDownloadLinks = downloadLinks.filter(
      (link) => link.trim().length > 0
    );

    try {
      const updatedRecord = {
        ...formData,
        downloadLinks: filteredDownloadLinks,
      };

      const response = await fetch(`${API_URL_BASE}/records/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRecord),
      });

      if (!response.ok) {
        throw new Error('Record update failed');
      }

      setMessage('Record updated successfully');

      // Reset success message after a few seconds
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage(error.message);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Record Details</h2>
        <div>
          <strong>Time:</strong> <TimeDisplay time={record.time} />
        </div>
        {Object.entries(formData).map(([key, value]) => {
          if (key !== 'id' && key !== 'time' && key !== 'clickCount') {
            if (key === 'downloadLinks') {
              return (
                <div key={key}>
                  <strong>{key}:</strong>
                  {downloadLinks.map((link, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={link}
                        onChange={(e) =>
                          handleDownloadLinkChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddLink}>
                    Add Link
                  </button>
                </div>
              );
            }
            return (
              <div key={key}>
                <strong>{key}:</strong>
                <input
                  type="text"
                  name={key}
                  value={value || ''}
                  onChange={handleInputChange}
                />
              </div>
            );
          }
          return null; // Exclude id, time, and clickCount fields from being editable
        })}
        <button type="submit">Save</button>
        <button type="button" onClick={handleDelete}>
            Delete
        </button>
      </form>
      {message && <div>{message}</div>}

      <div>
        <ClickCountGraph recordId={id}/>
      </div>
    </div>
  );
};

export default RecordDetails;