import { departmentDetails, getPapers, schoolDetails, scolor } from "../database/databaseFunction.js";


const getScholar = async (req,res) => {
    const sch = req.params;
    const [papyrus] = await scolor(sch);
    res.json({
        papyrus
    });
};

const getDept = async (req,res) => {
    const dep = req.params;
    const [names, charts, hindex, citescore] = await departmentDetails(dep);
    res.json({
        names,
        charts,
        hindex,
        citescore
    })

}

const getSchool = async (req,res) => {
    const schol = req.params;
    const [names, charts, hindex, citescore] = await schoolDetails(schol);
    res.json({
        names,
        charts,
        hindex,
        citescore
    });

};


export {getScholar, getDept, getSchool};