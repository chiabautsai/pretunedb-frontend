import React, { useEffect, useState, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { AuthContext } from '../contexts/AuthContext';
import { ApiContext } from '../contexts/ApiContext';

const ClickCountGraph = ({ recordId }) => {
    const { token } = useContext(AuthContext);
    const { apiUrlBase:API_URL_BASE } = useContext(ApiContext);
    const [clickCountData, setClickCountData] = useState([]);
  
    useEffect(() => {
      const fetchClickCountData = async () => {
        try {
          let url = `${API_URL_BASE}/clicks`;
          if (recordId) {
            url += `?filterBy=recordID&filterValue=${recordId}`;
          }
  
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not 200');
          }
          const data = await response.json();
          setClickCountData(data);
        } catch (error) {
          console.error('Error fetching click count data:', error);
        }
      };
  
      fetchClickCountData();
    }, [recordId, token, API_URL_BASE]);
  
    const calculateClickCounts = () => {
      const clickCounts = {};
      for (let i = 1; i <= 30; i++) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - (30 - i));
        clickCounts[currentDate.toDateString()] = 0;
      }
      clickCountData.forEach((click) => {
        const date = new Date(click.time);
        const formattedDate = date.toDateString();
        if (clickCounts.hasOwnProperty(formattedDate)) {
          clickCounts[formattedDate]++;
        }
      });
      return clickCounts;
    };
  
    const generateChartData = () => {
      const clickCounts = calculateClickCounts();
      const labels = Object.keys(clickCounts);
      const data = Object.values(clickCounts);
  
      return {
        labels,
        datasets: [
          {
            label: 'Click Counts',
            data,
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
          },
        ],
      };
    };
  
    const chartData = generateChartData();
  
    return (
      <div>
        <h2>Click Count Graph</h2>
        <Line data={chartData} />
      </div>
    );
};
  
export default ClickCountGraph;