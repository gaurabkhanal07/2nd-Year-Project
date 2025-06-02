import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';
import './HomePage.css';
import SchoolBarGraphData from './BarChart';
import DepartmentPublicationsPieChart from './PieChart';
import Hindex from './hindexdata'; // Import the Hindex component
import './TablePage.css';

const HomePage = () => {
  const [fact, setFact] = useState("Loading interesting facts...");
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [departments, setDepartments] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [schoolList, setSchoolList] = useState([]);
  const [facultyPapers, setFacultyPapers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [showHindex, setHindex] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/") // Replace with your actual backend endpoint
      .then((response) => response.json())
      .then((data) => {
        if (data && data.fact) {
          setFact(data.fact); // Assuming your API returns an object with a `fact` key
        } else {
          setFact("No facts available at the moment.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching facts:", err);
        setErrors("Failed to load facts. Please try again.");
        setLoading(false);
      });
  }, []);

  // Fetch school list
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/')
      .then((response) => response.json())
      .then((data) => setSchoolList(data.names))
      .catch((err) => {
        console.error('Error fetching schools:', err);
        setError('Failed to load schools. Please try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle school change
  const handleSchoolChange = (e) => {
    const school = e.target.value;
    setSelectedSchool(school);
    setSelectedDepartment('');
    setSelectedFaculty('');
    setShowTable(false);
    setHindex(false);
    setLoading(true);
    setError(null);

    if (school) {
      fetch(`http://localhost:3000/dropdown/${school}`)
        .then((response) => response.json())
        .then((data) => setDepartments(data.names))
        .catch((err) => {
          console.error('Error fetching departments:', err);
          setError('Failed to load departments. Please try again.');
        })
        .finally(() => setLoading(false));
    } else {
      setDepartments([]);
      setLoading(false);
    }
  };

  // Handle department change
  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    setSelectedFaculty('');
    setShowTable(false);
    setHindex(false);
    setLoading(true);
    setError(null);

    if (department) {
      fetch(`http://localhost:3000/dropdown/school/${department}`)
        .then((response) => response.json())
        .then((data) => setFacultyMembers(data.names))
        .catch((err) => {
          console.error('Error fetching faculty:', err);
          setError('Failed to load faculty members. Please try again.');
        })
        .finally(() => setLoading(false));
    } else {
      setFacultyMembers([]);
      setLoading(false);
    }
  };

  // Handle faculty change
  const handleFacultyChange = (e) => {
    const faculty = e.target.value;
    setSelectedFaculty(faculty);
    setLoading(true);
    setError(null);

    if (faculty) {
      fetch(`http://localhost:3000/dropdown/school/department/${faculty}`)
        .then((response) => response.json())
        .then((data) => {
          setFacultyPapers(data);
          setShowTable(true);
          setHindex(true);
        })
        .catch((err) => {
          console.error('Error fetching papers:', err);
          setError('Failed to load faculty papers. Please try again.');
        })
        .finally(() => setLoading(false));
    } else {
      setFacultyPapers([]);
      setShowTable(false);
      setHindex(false);
      setLoading(false);
    }
  };

  // Reset all selections
  const handleReset = () => {
    setSelectedSchool('');
    setSelectedDepartment('');
    setSelectedFaculty('');
    setDepartments([]);
    setFacultyMembers([]);
    setFacultyPapers([]);
    setShowTable(false);
    setHindex(false);
    setLoading(false);
    setError(null);
  };

  return (
    <div className="home-container">
      <header className="header">
        <nav className="navbar">
          <div className="title-card">RIDV</div>

          {/* School Dropdown */}
          <div className="dropdown">
            <select value={selectedSchool} onChange={handleSchoolChange}>
              <option value="">Select School</option>
              {schoolList.map((school, index) => (
                <option key={index} value={school.School}>
                  {school.School}
                </option>
              ))}
            </select>
          </div>

          {/* Department Dropdown */}
          <div className="dropdown">
            <select
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              disabled={!selectedSchool}
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept.Dept}>
                  {dept.Dept}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Dropdown */}
          <div className="dropdown">
            <select
              value={selectedFaculty}
              onChange={handleFacultyChange}
              disabled={!selectedDepartment}
            >
              <option value="">Select Faculty Member</option>
              {facultyMembers.map((faculty, index) => (
                <option key={index} value={faculty.scholar}>
                  {faculty.scholar}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="reset-button">
            <button onClick={handleReset}>Reset</button>
          </div>
        </nav>
      </header>

        <div className="newsletter-card">
          <h2>Did You Know?</h2>
          {loading ? (
              <p>Loading interesting facts...</p>
            ) : errors ? (
              <p className="error">{errors}</p>
            ) : (
              <p>{fact}</p>
          )}
        </div>

      <main className="main-content">
        {/* Loading or Error State */}
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display charts and H-index only if no scholar is selected */}
        {!selectedFaculty && (
          <>
            {/* Bar Chart Display */}
            <div className="faculty-papers-chart">
              <ResponsiveContainer width="100%" height={400}>
                <SchoolBarGraphData
                  selectedSchool={selectedSchool}
                  selectedDepartment={selectedDepartment}
                />
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Display */}
            <div className="pie-chart">
              <ResponsiveContainer width="100%" height={400}>
                <DepartmentPublicationsPieChart
                  selectedSchool={selectedSchool}
                  selectedDepartment={selectedDepartment}
                />
              </ResponsiveContainer>
            </div>

            {/* H-Index Display */}
            {(selectedSchool || selectedDepartment) && (
              <div className="hindex">
                <Hindex
                  selectedSchool={selectedSchool}
                  selectedDepartment={selectedDepartment}
                />
              </div>
            )}
          </>
        )}
      </main>
      <main className='selectedFaculty-content'>
        <div>
        {/* Faculty Papers Table */}
        {showTable && (
          <div className="papers-table">
          <h2>{selectedFaculty
            ? `Faculty papers published by ${selectedFaculty}`
            : "Faculty Publications"}   
          </h2>         
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
                {facultyPapers.papyrus.map((paper, index) => (
                  <tr key={index}>
                    <td>{paper.paper_id}</td>
                    <td>{paper.paper_title}</td>
                    <td>{paper.citation}</td>
                    <td>{paper.p_year}</td>
                    <td>{paper.publisher}</td>
                    <td>{paper.p_type}</td>
                    <td>
                      <a href={paper.URl} target="_blank" rel="noopener noreferrer">
                        Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
        <div>
          {showHindex && (
          <div className="hindex_faculty">
            <Hindex
              selectedSchool={selectedSchool}
              selectedDepartment={selectedDepartment}
              selectedFaculty={selectedFaculty}
            />
          </div>
        )}
        </div>
      
      </main>

    </div>
  );
};

export default HomePage;
