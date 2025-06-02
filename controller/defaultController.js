import { school } from "../database/databaseFunction.js";

export const getSchol = async (req,res) => {
    const [names,charts,highdept, highscholar, 
        hindexdept, citedept, hindexscholar, citescholar] = await school();
    res.json({names,
        charts,
        highdept,
        highscholar, 
        hindexdept, 
        citedept, 
        hindexscholar, 
        citescholar});
};
