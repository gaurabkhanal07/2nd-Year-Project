import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TablePage.css'

function TablePage() {
  const { personId } = useParams(); // Access the dynamic part of the URL
  const [data, setData] = useState([]);

  useEffect(() => {
    const url = `http://localhost:8002/paper/${personId}`; // Use the personId (scholar_id) from URL

    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setData(data); // Update state with fetched data
        })
        .catch((err) => console.log(err));
    }
  }, [personId]);

  return (
    <div>
      <h1>Faculty Publications</h1>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Paper ID</th>
            <th>Title</th>
            <th>Citations</th>
            <th>Year</th>
            <th>Publisher</th>
            <th>Type</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.paper_id}</td>
              <td>{d.paper_title}</td>
              <td>{d.citation}</td>
              <td>{d.p_year}</td>
              <td>{d.publisher}</td>
              <td>{d.p_type}</td>
              <td>{d.URL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablePage;
