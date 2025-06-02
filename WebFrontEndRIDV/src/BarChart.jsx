import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Legend } from "recharts";
import './HomePage.css';

const SchoolBarGraphData = ({ selectedSchool, selectedDepartment }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartTitle, setChartTitle] = useState("Research Papers Published");

  useEffect(() => {
    // Clear previous data to prevent showing outdated information
    setChartData([]);

    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "";
        if (selectedDepartment) {
          url = `http://localhost:3000/dropdown/school/${selectedDepartment}`;
          setChartTitle(`Research Papers by Scholars in ${selectedDepartment}`);
        } else if (selectedSchool) {
          url = `http://localhost:3000/dropdown/${selectedSchool}`;
          setChartTitle(`Research Papers by Departments in ${selectedSchool}`);
        } else {
          url = `http://localhost:3000/`;
          setChartTitle("Research Papers Published by Schools");
        }

        const response = await fetch(url);
        const data = await response.json();

   // Format data for the chart
const formattedData = data.names.map((item) => {
  // Determine the field to use for matching
  const isScholar = item.scholar !== undefined;
  const isSchool = item.School !== undefined;
  const isDept = item.Dept !== undefined;

  // Find corresponding chart data by matching scholar, School, or Dept
  const matchingChart = data.charts.find(chart =>
    isScholar
      ? chart.scholar === item.scholar
      : isSchool
      ? chart.School === item.School
      : chart.Dept === item.Dept
  );

  return {
    name: selectedDepartment
      ? item.scholar || item.Dept || item.School
      : isScholar
      ? item.scholar
      : isSchool
      ? item.School
      : item.Dept,
    papers: matchingChart ? matchingChart.paper_amt : 0, // Use 0 if no matching chart data
  };
});




        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSchool, selectedDepartment]); // Trigger whenever these dependencies change

  if (loading) {
    return <p>Loading...</p>;
  }

  if (chartData.length === 0) {
    return (
      <div className="chart-container">
        <h3 className="chart-title">{chartTitle}</h3>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{chartTitle}</h3>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
        >
          {/* X Axis - Paper count */}
          <XAxis
            type="number"
            dataKey="papers"
            tick={{ fill: "#b185db", fontWeight: "bold" }}
            axisLine={{ stroke: "#b185db" }}
            tickLine={{ stroke: "#b185db" }}
          />

          {/* Y Axis - Name of entity */}
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "#b185db", fontWeight: "bold" }}
            axisLine={{ stroke: "#b185db" }}
            tickLine={{ stroke: "#b185db" }}
            width={200}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1a1a",
              color: "#ffffff",
              border: "1px solid #b185db",
            }}
            labelStyle={{ color: "#b185db" }}
          />

          

          {/* Bar for displaying paper counts */}
          <Bar
            dataKey="papers"
            name="Papers Published"
            fill="#b185db"
            barSize={30}
            radius={[0, 15, 15, 0]}
          >
            <LabelList
              dataKey="papers"
              position="right"
              style={{ fill: "#ffffff", fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SchoolBarGraphData;
