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


const db_dprri_pdip = require('../../../json_file/dpr_ri/1_calon_dprd_ri');

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

    converting : (req, res, next) => {

        var text1 = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:vcard="http://www.w3.org/2001/vcard-rdf/3.0#"'+
            'xmlns:j.0="http://www.w3.org/ns/org#">' +
            '<rdf:Description rdf:about="http://DPR_RI">' +
            '<j.0:classification>Pemilihan Umum Legislatif Indonesia</j.0:classification>' +
            '<vcard:Tahun>2018</vcard:Tahun>' +
            '<j.0:headOf>' +
            '<rdf:Description rdf:about="http://PARTAI_DEMOKRASI_INDONESIA_PERJUANGAN">' +
            '<j.0:headOf>';
      
    
        var text = "";
        var closeRDF = '</rdf:RDF>';
        var closeDesc = '</rdf:Description>';
        var closeHeadOf = '</j.0:headOf>';
        var temp_dapil = ""
        _(db_dprri_pdip).forEach( (val, key) => {

            replaceSpace  = val.nama.replace(" ", "_");
            dapilTextStart = '<rdf:Description rdf:about="http://' + replaceSpace + '">';
            vcard_id_wilayah = '<vcard:id_wilayah>'+ val.idWilayah +'</vcard:id_wilayah>';
            headOf = '<j.0:headOf>';
            
            var temp_calon = "";
            _(val.calon).forEach( (val1, key1) => {

                replaceSpace  = val1.nama.replace(" ", "_");
                descrp_calon = '<rdf:Description rdf:about="http://'+ replaceSpace +'">';
                vcard_nama = '<vcard:nama>'+ val1.nama +'</vcard:nama>';
                vcard_namaKab = '<vcard:namaKab>'+ val1.namaKab +'</vcard:namaKab>';
                vcard_JenisKelamin = '<vcard:JenisKelamin>'+ val1.stringJenisKelamin +'</vcard:JenisKelamin>';
                vcard_Filename = '<vcard:Filename>'+ val1.originalFilename +'</vcard:Filename>';
                vcard_noUrut = '<vcard:noUrut>'+ val1.idWinoUrutlayah +'</vcard:noUrut>';


                temp_calon = descrp_calon + vcard_nama + vcard_namaKab + vcard_JenisKelamin + vcard_Filename + vcard_noUrut + closeDesc;


            });

            temp_dapil = temp_dapil + dapilTextStart + vcard_id_wilayah + headOf + temp_calon + closeHeadOf + closeDesc;



        });

        result = text1 + temp_dapil + closeHeadOf + closeDesc + closeHeadOf + closeDesc + closeRDF;
        console.log(result)
        res.setHeader('Content-Type', 'application/json');
        return res.send({ data: result })
        

    },

}

module.exports = data;