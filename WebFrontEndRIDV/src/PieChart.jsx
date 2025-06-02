import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import './HomePage.css';

const DepartmentPublicationsPieChart = ({ selectedSchool, selectedDepartment }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (selectedDepartment) {
          // Fetch scholar data for the selected department
          response = await fetch(
            `http://localhost:3000/dropdown/school/${selectedDepartment}`
          );
        } else if (selectedSchool) {
          // Fetch department data for the selected school
          response = await fetch(
            `http://localhost:3000/dropdown/${selectedSchool}`
          );
        } else {
          // Fetch data for all schools
          response = await fetch('http://localhost:3000/');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Calculate total papers
// Calculate total papers
const totalPapers = data.charts.reduce((sum, item) => sum + (item.paper_amt || 0), 0);

// Format data for the pie chart
const formattedData = data.names.map((item) => {
  // Determine the type of data: scholar, Dept, or School
  const isScholar = 'scholar' in item;
  const isSchool = 'School' in item;
  const isDept = 'Dept' in item;

  // Find corresponding chart data
  const matchingChart = data.charts.find(chart =>
    isScholar
      ? chart.scholar === item.scholar
      : isSchool
      ? chart.School === item.School
      : chart.Dept === item.Dept
  );

  // Format data for the pie chart
  return {
    name: selectedDepartment
      ? (item.scholar || 'Unknown Scholar')
      : selectedSchool
      ? (item.Dept || 'Unknown Department')
      : (item.School || 'Unknown School'),
    papers: matchingChart ? matchingChart.paper_amt || 0 : 0,
    percentage:
      totalPapers > 0
        ? ((matchingChart ? matchingChart.paper_amt || 0 : 0) / totalPapers) * 100
        : 0,
  };
});



        setChartData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSchool, selectedDepartment]);

  const COLORS = [
    '#6a4c93', // Purple
    '#1982c4', // Blue
    '#8ac926', // Green
    '#ff924c', // Orange
    '#9d4edd', // Violet
    '#3a86ff', // Sky Blue
    '#333333', // Dark Gray
  ];

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        {selectedDepartment
          ? `Scholar Publications in ${selectedDepartment}`
          : selectedSchool
          ? `Department Publications in ${selectedSchool}`
          : 'School Publications'}
      </h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && chartData.length > 0 && (
        <>
          <ResponsiveContainer width="101%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={130}
                dataKey="papers"
                stroke="none"
                nameKey="name"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#3a86ff',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '10px',
                }}
                formatter={(value, name, props) => [
                  `${props.payload.percentage.toFixed(2)}% of total`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend Section */}
          <div className="legend-container" style={{ marginTop: '-30px' }}>
            {chartData.map((entry, index) => (
              <div key={index} className="legend-item" style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    width: '15px',
                    height: '15px',
                    marginRight: '10px',
                  }}
                />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {!loading && !error && chartData.length === 0 && <p>No data available</p>}
    </div>
  );
};

DepartmentPublicationsPieChart.propTypes = {
  selectedSchool: PropTypes.string,
  selectedDepartment: PropTypes.string,
};

export default DepartmentPublicationsPieChart;
