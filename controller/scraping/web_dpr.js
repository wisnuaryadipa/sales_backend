

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


var responseHTML = '';

var arrURL_DPR = [];

var detail_DPR = {
    nama: '',
    email: '',
    fraksi: '',
    agama: '',
    ttl: '',
    dapil: '',
    riwayat_pendidikan: [],
    riwayat_pekerjaan: [],
    riwayat_organisasi: [],
    riwayat_pergerakan: [],
    riwayat_penghargaan: []
}
var responseApi;

var data = {


    getDataHTML : async (req, res, next) => {


        const agent = new https.Agent({  
            rejectUnauthorized: false
        });


        url = "file:///F:/node/scraping/json_file/dpr_ri/dpr.html"

        fs.readFile('F:/node/scraping/json_file/dpr_ri/dpr.html', 'utf8', function(err, html){
            if(err){
                console.log(err);
            }else{
                responseHTML = html;
            }
        });

        var $ = cheerio.load(responseHTML, {
            decodeEntities: false
        });

        $ = cheerio.load($.html().toString());

        var split_header = $('.img-responsive').map((i, x) => $(x).attr('src')).toArray();


        for (let index = 0; index < split_header.length; index++) {
            const getIndexLastSlash = split_header[index].lastIndexOf("photo/") + 6;
            const getIndexBeforeJPG = split_header[index].lastIndexOf(".jpg");

            var ID_DPR = split_header[index].substring(getIndexLastSlash, getIndexBeforeJPG);
            
            arrURL_DPR.push('http://www.dpr.go.id/blog/profil/id/'+ID_DPR);

            console.log(arrURL_DPR)
        }


        // for (let index = 0; index < split_header.length; index++) {
        //     const getIndexLastSlash = split_header[index].lastIndexOf("photo/") + 6;
        //     const getIndexBeforeJPG = split_header[index].lastIndexOf(".jpg");

        //     var ID_DPR = split_header[index].substring(getIndexLastSlash, getIndexBeforeJPG);
            
        //     var get  = await axios.get('http://www.dpr.go.id/blog/profil/id/'+ID_DPR, { httpsAgent: agent });

        //     if (responseApi) {
                
        //         responseApi = _.concat(responseApi, get.data);

        //     } else {
                
        //         responseApi = get.data;

        //     }
            
        // }

        return res.send(arrURL_DPR)
    },


    getDetailDPR : async (req, res, next) => {

        const agent = new https.Agent({  
            rejectUnauthorized: false
        });

        url = req.query.url_dpr;
        ID_DPR = 1320;
        var get  = await axios.get(url, { httpsAgent: agent });


        var $ = cheerio.load(get, {
            decodeEntities: false
        });

        $ = cheerio.load($.html().toString());

        detail_DPR.nama = $('.col-md-9.col-md-pull-4.mb30').children('.text-center').eq(1).text()
        detail_DPR.email = $('.col-md-9.col-md-pull-4.mb30').children('.text-center').eq(2).text()
        detail_DPR.fraksi = $('.anggota').children('.mb5').eq(3).children().eq(1).text()
        detail_DPR.dapil = $('.anggota').children().eq(5).children().eq(1).text()
        detail_DPR.ttl = $('.keterangan').children('.clearfix').eq(1).children('.input').text()
        detail_DPR.agama = $('.keterangan').children('.clearfix').eq(2).children('.input').text()
        detail_DPR.riwayat_pendidikan = $('.link-list').eq(0).children('.items').children('.custom-button').children('li').map((i, x) => $(x).text()).toArray()
        detail_DPR.riwayat_pekerjaan = $('.link-list').eq(1).children('.items').children('.custom-button').children('li').map((i, x) => $(x).text()).toArray()
        detail_DPR.riwayat_organisasi = $('.link-list').eq(2).children('.items').children('.custom-button').children('li').map((i, x) => $(x).text()).toArray()
        detail_DPR.riwayat_pergerakan = $('.link-list').eq(3).children('.items').children('.custom-button').children('li').map((i, x) => $(x).text()).toArray()
        detail_DPR.riwayat_penghargaan = $('.link-list').eq(4).children('.items').children('.custom-button').children('li').map((i, x) => $(x).text()).toArray()

        console.log(detail_DPR);
        var jsonContent = JSON.stringify(detail_DPR);
        
        res.setHeader('Content-Type', 'application/json');
        return res.send(jsonContent)

    }



}



module.exports = data;