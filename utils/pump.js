import * as csv from 'csv';

export default class Pump {

    static getTransform = () => {
        let  rowCount = 0;
        
        return csv.transform(function(row, cb) {
            let line = null;
            
            if (rowCount === 0){
                let firstField = row[0];

                if (firstField !== 'deviceid'){
                    throw new Error('file is not for pump');
                }
            } 
            else {
                let metricsPsum = JSON.parse(row[3])['Psum'];
                
                metricsPsum.date = Number(row[1]);
                line =  JSON.stringify(metricsPsum) + '\n';
            }            

            rowCount++;            
        
            cb(null, line);
        });
    }

    
}
