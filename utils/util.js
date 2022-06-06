import Pump from './pump.js';
import Compressor from './compressor.js';
import stream from 'stream';
import * as fs from 'fs';
import * as csv from 'csv';

export default class Util {
    
    static getStates = async (file) => {
        let result = {};

        try {
            result.data = await this.parseData(file, Pump.getTransform());
            result.type = 'pump';
        } 
        catch (error) {
            try {
                console.log(error);

                result.data = await this.parseData(file, Compressor.getTransform());
                result.type= 'compressor';
            } 
            catch (error) {
                console.log(error);
                return error;
            }
        }

        const maxValue = result.data.reduce((ac, v) => Math.max(ac, v.avgvalue), 0);
            
        const sum = result.data.reduce((ac, v) => ac + v.avgvalue, 0);
        const operatingLoad = sum / result.data.length;

        const dataSorted = result.data.sort((a, b) => a.date - b.date);

        return { maxValue: maxValue, data: dataSorted, operatingLoad: operatingLoad, type: result.type };
    }

    static parseData = (file, transform) => {
        return new Promise((resolve, reject) =>{           
            let read = fs.createReadStream(file.path),
                parse = csv.parse(),
                result = [];
     
            let converter = new stream.Writable({
                write(chunk, encoding, callback) {
                    result.push(JSON.parse(chunk));
                    callback();  
                }  
            });      
        
            converter.on('finish', function() {
                resolve(result);
            });

            read.pipe(parse).pipe(transform).on('error', e => {
                reject(e.message);
            }).pipe(converter)
            
        });
    }
}
