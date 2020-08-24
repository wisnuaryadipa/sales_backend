const request = require('request');
const fs = require('fs');
const http = require('http');
const _ = require('lodash');
const moment = require('moment');
const axios = require("axios");
const cheerio = require('cheerio');
const psl = require('psl');
const extractDomain = require('extract-domain');



var responseApi = [];
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

    getDomain : (url) => {

        domain = extractDomain(url);

        var parsed = psl.parse(domain);
        return parsed.sld;

    },

    sleep : (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    },

    fetchdata : async (url) => {

        const getfromSite = await axios.get(url).then(data.sleep(1000));

        var $ = cheerio.load(getfromSite, {
            decodeEntities: false
        });

        $ = cheerio.load($.html().toString());

        return $;
    },

    scraping : async (req, res) => {

        var URL = 'https://money.kompas.com/read/2020/05/11/093711026/ketahui-perbedaan-thr-dan-gaji-ke-13-pns';
        // var URL = 'https://finance.detik.com/berita-ekonomi-bisnis/d-5009601/kai-operasikan-kereta-api-luar-biasa-mulai-12-mei-ini-rutenya';
        // var URL = 'https://finance.detik.com/energi/d-5010224/orang-miskin-baru-bakal-banjiri-ri-turunkan-harga-bbm';
        // var URL = 'https://dunia.tempo.co/read/1340802/intelijen-as-selidiki-data-telepon-seluler-di-laboratorium-wuhan';
        
        // Parsing nama domain
        domainName = data.getDomain(URL);

        // Kondisi untuk setiap nama domain
        if (domainName.toString().toLowerCase() == 'kompas') {

            await data.scrapingKompas(URL);

        } else if (domainName.toString().toLowerCase() == 'detik'){

            await data.scrapingDetik(URL);

        } else if (domainName.toString().toLowerCase() == 'tempo'){

            await data.scrapingTempo(URL);

        }

        return res.send(html_dumper);
    },

    scrapingKompas : async (URL) => {

        URL_merge = URL + '?page=all';
        var $ = await data.fetchdata(URL_merge);
        $('.read__content p strong').remove();
        html_dumper.url = URL;
        html_dumper.judul = $('.read__title').html();
        html_dumper.waktu = $('.read__time').text();
        html_dumper.editor = $('.read__credit__item a').text();
        html_dumper.body.raw = $('.read__content').html();
        html_dumper.body.preprocessing = $('.read__content').text();
        console.log('Scraping Kompas Berhasil !');

    },
    
    scrapingDetik : async (URL) => {

        URL_merge = URL + '?single';
        var $ = await data.fetchdata(URL_merge);
        $('.linksisip').remove();
        $('.clearfix').remove();
        $('.detail_tag').remove();
        $('br').nextAll().remove();
        html_dumper.url = URL;
        html_dumper.judul = $('.jdl h1').html();
        html_dumper.waktu = $('.date').text();
        html_dumper.reporter = $('.author').text();
        html_dumper.body.raw = $('#detikdetailtext').html();
        html_dumper.body.preprocessing = $('#detikdetailtext').text();
        console.log('Scraping Detik Berhasil !');

    },
    
    scrapingTempo : async (URL) => {

        var $ = await data.fetchdata(URL);
        html_dumper.url = URL;
        html_dumper.judul = $('.headline').html();
        html_dumper.waktu = $('.sub-head > .date').text();
        html_dumper.editor = $("*[itemprop = 'editor']").text();
        html_dumper.body.raw = $('#isi p').html();
        html_dumper.body.preprocessing = $('#isi p').text();
        console.log('Scraping Tempo Berhasil !');

    }


}

module.exports = data;