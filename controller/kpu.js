const request = require('request');
const fs = require('fs');
const http = require('http');
const _ = require('lodash');
const moment = require('moment');
const axios = require("axios");
const cheerio = require('cheerio');
const psl = require('psl');
const extractDomain = require('extract-domain');
const https = require('https');

//Json File
const db_prov_kpu = require('../ProvinsiKPU');
const db_partai = require('../json_file/detail_partai');




var responseApi;

var macam_partai = {
    id_partai : 0,
    nama_partai : '',
}

var detail_kpu = {
    partai : {
        jumlah_partai : {
            start: 1,
            end: 20
        },
        macam_partai : []
    }
}

var html_dumper = {
    judul: '',
    waktu: '',
    url: '',
    reporter: '',
    editor: '',
    body: {
        raw: '',
        preprocessing: '',
        stemming: ''
    },
    komentar: [
        {
            nama: '',
            waktu: '',
            komentar: ''
        }
    ],
    sentiment: '',



};


var data = {


    sleep : (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

    fetchdataHTML : async (url) => {

        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        const getfromSite = await axios.get(url, { httpsAgent: agent }).then(data.sleep(1000));

        var $ = cheerio.load(getfromSite, {
            decodeEntities: false
        });

        $ = cheerio.load($.html().toString());

        return $;
    },


    fetchdataDPRRI : async (req, res, next) => {

        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        url = "https://infopemilu.kpu.go.id/pileg2019/pencalonan/1/dcs-dpr.json"
        const getfromSite = await axios.get(url, { httpsAgent: agent });

        let promises = [];
        for (i = 0; i < db_prov_kpu.length; i++) {

            var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/'+ db_prov_kpu[i] +'/dcs-dpr.json', { httpsAgent: agent });

            if (responseApi) {
                
                responseApi = _.concat(responseApi, get.data);

            } else {
                
                responseApi = get.data;

            }
            
        }

        for (let index = 0; index < responseApi.length; index++) {
            
            var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/pengajuan-calon/'+ responseApi[index].id +'/3/dct', { httpsAgent: agent });

            responseApi[index].calon = get.data
            console.log(responseApi[index])
        }

        console.log(responseApi)

        var jsonContent = JSON.stringify(responseApi);
        
        res.setHeader('Content-Type', 'application/json');
        return res.send(jsonContent)
    },

    
    fetchdataDPRDPROV : async (req, res, next) => {
        console.log('start')
        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        url = "https://infopemilu.kpu.go.id/pileg2019/pencalonan/1/dcs-dpr.json"
        const getfromSite = await axios.get(url, { httpsAgent: agent });

        let promises = [];
        for (i = 0; i < db_prov_kpu.length; i++) {

            var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/'+ db_prov_kpu[i] +'/dcs-prov.json', { httpsAgent: agent });

            if (responseApi) {
                
                responseApi = _.concat(responseApi, get.data);

            } else {
                
                responseApi = get.data;

            }
            
        }


        for (let index = 0; index < responseApi.length; index++) {
            
            var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/pengajuan-calon/'+ responseApi[index].id +'/3/dct', { httpsAgent: agent });

            responseApi[index].calon = get.data
            
            var jsonContent = JSON.stringify(responseApi);
            fs.writeFileSync("calon_dprd_prov.json", jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    
                }
                console.log("JSON file has been saved.");
                
            });
            // console.log(responseApi[index])
        }

        // console.log(responseApi)

        
        console.log('finish')
        res.setHeader('Content-Type', 'application/json');
        return res.send(jsonContent)
    },

    fetchdataPartai : async(req, res, next) => {
        console.log('start');
        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        var arr_macam_partai = [];
        for (i = detail_kpu.partai.jumlah_partai.start; i <= detail_kpu.partai.jumlah_partai.end; i++) {

            var URL = 'https://infopemilu.kpu.go.id/pileg2019/pencalonan/daftar-calon/dct/'+ i ;
            var $ = await data.fetchdataHTML(URL);
            var split_header = $('.page-header').text().split('-');
            var nama_partai = split_header[1];

            macam_partai = {};
            macam_partai.id_partai = i;
            macam_partai.nama_partai = nama_partai;

            arr_macam_partai.push(macam_partai);
            
            console.log(macam_partai);
            console.log(arr_macam_partai);
        }

        detail_kpu.partai.macam_partai = arr_macam_partai;
        responseApi = detail_kpu.partai.macam_partai;
        var jsonContent = JSON.stringify(responseApi);
        fs.writeFileSync("json_file/detail_partai.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                
            }
            console.log("JSON file has been saved.");
            
        });
        console.log('finish');
        res.setHeader('Content-Type', 'application/json');
        return res.send(jsonContent)

    },

    fetchdataDPRRI2 : async (req, res, next) => {

        const agent = new https.Agent({  
            rejectUnauthorized: false
        });


        // for (let indexPartai = 1; indexPartai <= db_partai.length; indexPartai++) {
            
        //     responseApi  = [];        
        //     url = "https://infopemilu.kpu.go.id/pileg2019/pencalonan/"+indexPartai+"/dcs-dpr.json"
        //     const getfromSite = await axios.get(url, { httpsAgent: agent });

        //     for (i = 0; i < db_prov_kpu.length; i++) {

        //         var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/'+ db_prov_kpu[i] +'/dcs-dpr.json', { httpsAgent: agent });

        //         if (responseApi) {
                    
        //             responseApi = _.concat(responseApi, get.data);

        //         } else {
                    
        //             responseApi = get.data;

        //         }
                
        //     }

        //     for (let index = 0; index < responseApi.length; index++) {
                
        //         var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/pengajuan-calon/'+ responseApi[index].id +'/'+indexPartai+'/dct', { httpsAgent: agent });

        //         responseApi[index].calon = get.data

                
        //         console.log(responseApi[index])
        //     }

        //     var jsonContent = JSON.stringify(responseApi);
        //     fs.writeFileSync("json_file/"+indexPartai+"_calon_dprd_ri.json", jsonContent, 'utf8', function (err) {
        //         if (err) {
        //             console.log("An error occured while writing JSON Object to File.");
                    
        //         }
        //         console.log("JSON file has been saved.");
                
        //     });
        // }


        
        for (let indexPartai = 9; indexPartai <= db_partai.length; indexPartai++) {


            let promises = [];
            responseApis  = [];    
            for (i = 0; i < db_prov_kpu.length; i++) {
    
                var get  = await axios.get('https://infopemilu.kpu.go.id/pileg2019/pencalonan/'+ db_prov_kpu[i] +'/dcs-prov.json', { httpsAgent: agent });
    
                if (responseApis) {
                    
                    responseApis = _.concat(responseApis, get.data);
    
                } else {
                    
                    responseApis = get.data;
    
                }
    
                
            }
    
            for (let index = 0; index < responseApis.length; index++) {
                
                url = 'https://infopemilu.kpu.go.id/pileg2019/pencalonan/pengajuan-calon/'+ responseApis[index].id +'/'+indexPartai+'/dct';
                var get  = await axios.get(url, { httpsAgent: agent });
    
                responseApis[index].calon = get.data
                
                // console.log(responseApi[index])
                console.log(responseApis[index])
            }
            
            var jsonContent = JSON.stringify(responseApis);
            fs.writeFileSync("json_file/"+indexPartai+"_calon_dprd_prov.json", jsonContent, 'utf8', function (err) {
                if (err) {
                    console.log("An error occured while writing JSON Object to File.");
                    
                }
                console.log("JSON file has been saved.");
                
            });

        }

        // console.log(responseApi)

        var jsonContent = JSON.stringify(responseApi);
        
        res.setHeader('Content-Type', 'application/json');
        return res.send(jsonContent)
    },



}


module.exports = data;