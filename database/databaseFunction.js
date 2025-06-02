import { createPool } from 'mysql2';
import dotenv from "dotenv"

dotenv.config();

const pool = createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
}).promise();

export async function schoolDetails ( school ){
    try{
        const deptNames = await getDepartment(school);
        const schoolCharts = await getSchoolCharts(school);
        const [h_index, citescore] = await getSchoolhincite(school);
        
        return [deptNames, schoolCharts, h_index, citescore];
    }
    catch (err){
        console.error("Return error: ",err);
        throw err;
    }
};

export async function departmentDetails (dept) {
    try{
        const scholarNames = await getScholar(dept);
        const deptCharts = await deptChart(dept);
        const [h_index, citescore] = await deptscore(dept);
        return [ scholarNames, deptCharts, h_index, citescore];
    }
    catch (err){
        console.error('Return error:',err);
        throw err;
    }
}

export async function school () {
    try{
        const schoolnames = await getSchool();
        const schoolcharts = await getSchoolchart();
        const highdept = await depthigh();
        const highscholar = await scholarhigh();
        const hindexdept = await hindexdepthigh();
        const citedept = await citedepthigh();
        const hindexscholar = await hindexscholarhigh();
        const citescholar = await citescholarhigh();

        return [ schoolnames, schoolcharts,  highdept, highscholar, 
            hindexdept, citedept, hindexscholar, citescholar];
    }
    catch (err){
        console.error('Return error:',err);
        throw err;
    }
}

export async function scolor (sch) {
    try{
        const papers = await getPapers(sch);
        return [ papers];
    }
    catch (err){
        console.error('Return error:',err);
        throw err;
    }
}

//fetch list of schools
export async function getSchool() {
    try {
        const [result] = await pool.query(`
        SELECT School
        FROM tbl_school
        `);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//fetch list of schools
export async function getSchoolchart() {
    try {
        const [result] = await pool.query(`
        SELECT School, paper_amt
        FROM tbl_school
        `);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

// Fetch departments for a specific school
export async function getDepartment(school) {
    try {
        const [result] = await pool.query(`
        SELECT d.*
        FROM tbl_department d
        INNER JOIN tbl_school s ON d.SID = s.SID
        WHERE s.School = ?
        `,[school.school]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Fetch data for bar chart and pie chart
export async function getSchoolCharts(school) {
    try {
        const [result] = await pool.query(`
        SELECT 
            d.Dept,         
            dc.paper_amt    
        FROM 
            tbl_school s
        INNER JOIN 
            tbl_department d ON s.SID = d.SID
        INNER JOIN 
            tbl_dep_count dc ON d.DID = dc.DID
        WHERE 
            s.School = ?
        `, [school.school]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//fetch data for hindex and ite score of school
export async function getSchoolhincite(school) {
    try {
        const [result] = await pool.query(`
        SELECT hindex, cite_score
        FROM tbl_school s
        WHERE s.School = ?
        `, [school.school]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

// Fetch scholars for a specific department
export async function getScholar(dept) {
    try {
        const [result] = await pool.query(`
        SELECT sc.scholar_id, sc.scholar
        FROM tbl_scholar sc
        INNER JOIN tbl_department d ON sc.DID = d.DID
        WHERE d.Dept = ?
        `,[dept.department]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Fetch data for bar chart and pie chart for scholar of the department
export async function deptChart(dept) {
    try {
        const [result] = await pool.query(`
        SELECT 
            s.scholar,         
            c.paper_amt    
        FROM 
            tbl_department d
        INNER JOIN 
            tbl_count c ON d.DID = c.DID
        INNER JOIN 
            tbl_scholar s ON s.scholar_id = c.scholar_id
        WHERE 
            d.Dept =?
        `, [dept.department]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

// Fetch department hindex and citescore for a specific department
export async function deptscore(dept) {
    try {
        const [result] = await pool.query(`
        SELECT dp.hindex, dp.cite_score
        FROM tbl_dep_count dp
        INNER JOIN tbl_department d ON dp.DID = d.DID
        WHERE d.Dept = ?
        `,[dept.department]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

// Fetch papers for a specific scholar
export async function getPapers(ID) {
    try {
        const [result] = await pool.query(`
        SELECT p.*, a.*, pa.*
        FROM tbl_paper p
        INNER JOIN tbl_paper_author pa ON p.paper_id = pa.paper_id
        INNER JOIN tbl_scholar a ON pa.author_id = a.scholar_id
        WHERE a.scholar = ?
        `, [ID.scholar]);
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of paper of department with department name
export async function depthigh() {
    try {
        const [result] = await pool.query(`
        SELECT department,paper_amt
        FROM tbl_dep_count
        WHERE paper_amt = (
        SELECT MAX(paper_amt) 
        FROM tbl_dep_count
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of paper of scholar with that scholar name
export async function scholarhigh() {
    try {
        const [result] = await pool.query(`
        select s.scholar,c.paper_amt
        from tbl_count as c
        inner join tbl_scholar as s
        on c.scholar_id=s.scholar_id
        WHERE paper_amt = (
        SELECT MAX(paper_amt) 
        FROM tbl_count 
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of h-index of department with department name
export async function hindexdepthigh() {
    try {
        const [result] = await pool.query(`
        SELECT department,hindex
        FROM tbl_dep_count
        WHERE hindex = (
        SELECT MAX(hindex) 
        FROM tbl_dep_count
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of cite_score of department with department name
export async function citedepthigh() {
    try {
        const [result] = await pool.query(`
        SELECT department,cite_score
        FROM tbl_dep_count
        WHERE cite_score = (
        SELECT MAX(cite_score) 
        FROM tbl_dep_count
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of h-index of scholar with scholar name
export async function hindexscholarhigh() {
    try {
        const [result] = await pool.query(`
        SELECT scholar,h_index
        FROM tbl_scholar
        WHERE h_index = (
        SELECT MAX(h_index) 
        FROM tbl_scholar
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};

//Most number of cite-score of scholar with scholar name
export async function citescholarhigh() {
    try {
        const [result] = await pool.query(`
        SELECT scholar,cite_score
        FROM tbl_scholar
        WHERE cite_score = (
        SELECT MAX(cite_score) 
        FROM tbl_scholar
        )`
        );
        return result;
    }
    catch (err){
        console.error("Database query error:", err);
        throw err; // Let the error propagate to the caller
    }
};