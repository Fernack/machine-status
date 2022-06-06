import * as csv from 'csv';

export default class Compressor {
    static getTransform = () => {
        let  rowCount = 0;
        
        return csv.transform(function(row, cb) {
            let line = null;
            
            if (rowCount === 0){
                let firstField = row[0];

                if (firstField !== 'timestamp'){
                    throw new Error('file is not for compressor');
                }
            } 
            else {
                if (row[1] === 'Psum_kW'){
                    line = JSON.stringify({date: Number(row[0]), avgvalue: Number(row[4])}) + '\n';
                }
            }            

            rowCount++;            
        
            cb(null, line);
        });
    }    
}
