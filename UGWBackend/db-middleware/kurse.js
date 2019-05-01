const fetch = require("node-fetch");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
/**
 * 
 * @param {String} stufe - e.g.: Q1, EF, 05C
 * @param {String} stufeid - e.g.: c00021.htm
 * @param {String[2]} wochen - ['A-Woche', 'B-Woche'], e.g.: ['08', '09']
 * @param {String} creds - base64 of 'user:pass'
 * @returns {Promise<any>} retult
 */
async function getKurseAndTT(stufe, stufeid, wochen, creds) { // returns promise
    
    if (!wochen[0] || !wochen[1]) throw new Error('Internal Error: #01');

    const res = await fetchWithCreds(`/Schueler-Stundenplan/${wochen[0]}/c/${stufeid}`, creds);
    if (!res.ok) throw new Error('Failure: Connection could not be made');
 
    let _kurse = [{kurse: []}, {kurse: []}]; // {kurse: {title: string; fach: string; lehrer: string; selected?: boolean; ph?: boolean}[]}[]
    let tempTTs = []; // { stufe: string, tt: { days: any[][]}[] }[]

    try{
        let r = await res.textConverted();

        evaKurse(r, stufe, tempTTs, _kurse);
        //woche 2
        const res2 = await fetchWithCreds(`/Schueler-Stundenplan/${wochen[1]}/c/${stufeid}`, creds);
        r = await res2.textConverted();

        evaKurse(r, stufe, tempTTs, _kurse);
        let k = [];
        _kurse[0].kurse.forEach((val) => {
            _kurse[1].kurse.forEach((val2) => {
                if (val2 === val) k.push(val);
            });
        });
        let fin = [];
        _kurse[0].kurse.forEach((val) => {
            if (k.indexOf(val) === -1) fin.push(val);
        });
        _kurse = [{kurse: []},{kurse: []}];        
        return({kurse: fin, tt: tempTTs[0].tt});

    }catch(err){
        console.log(err);
        throw new Error('Failure: ' + err.statusText);
    }
}

async function fetchWithCreds(route, creds) {
    const baseURL = 'https://gymnasium-wuerselen.de/untis';
    const url = baseURL + route;

    return fetch(url, {
        headers: {
            "User-Agent": "UGW Bot",
            "Authorization": `Basic ${creds}`
        }
    });
}


function evaKurse(html, stufe, tempTTs, kurse) {
    let dom = new JSDOM(html);
    const doc = dom.window.document;
    let woche = ((
            doc.querySelectorAll('font[size="3"][face="Arial"]')[1]
        )
    ).textContent.split(/(?:\d+\.){2}\d{4} /)[1][0].toLowerCase() === "a"? 0: 1;

    let wholeTable = doc.getElementsByTagName('tbody')[0];
    // remove header
    wholeTable.firstChild.remove();

    let data = [];
    let tri = 0;

    
    Array.from( wholeTable.children ).forEach(function (tr) {

        if(tr.textContent.trim() === ""){
            // tr is Empty
            return;
        }
        tri++;

        let stunde = [];

        Array.from(tr.children).forEach(function (td, tag) {
            if(tag === 0) return; // Exclude number
            // Tag: 1: Mo, 2: Di, ...

            if(/^\npause\n/i.test(td.textContent) || td.textContent === "") {
                // @ts-ignore
                stunde.push({isUsed: true});
                return;
            }

            const doppelStunde = (td.getAttribute('rowspan') === "4");

            let info = Array.from(td.getElementsByTagName('tr'));

            let isUsed = false;
            if(!doppelStunde){
                let indexOfFirstSmallSlotBefore = data[data.length-1].findIndex((e)=> !e.isBig && !e.isUsed);
                tag = indexOfFirstSmallSlotBefore === -1? tag : indexOfFirstSmallSlotBefore + 1;
                if(indexOfFirstSmallSlotBefore !== -1){
                    data[data.length-1][indexOfFirstSmallSlotBefore].isUsed = true;
                    isUsed = true;
                }
                // +1 to counter following -1, which is needed because of the exclusion
            }


            //
            // Klassenstunde
            //
            if (info.length === 1){
                let spaltenRaw = Array.from( info[0].getElementsByTagName('font') );
                let spalten = spaltenRaw.map(x => x.textContent.replace(/\n/g, ""));

                stunde.push({
                    type: 'klasse',
                    isBig: doppelStunde,
                    fach: spalten[0],
                    lehrer: spalten[1],
                    raum: spalten[2],
                    tag: tag - 1,
                    isUsed: isUsed
                });
            }else{
                //
                // Kursstunde
                //

                // GK01, ...
                const title = td.getElementsByTagName('b')[0].textContent;

                let raeume = [];

                info.forEach(function (infos, infoi) {
                    if(infoi === 0) return;

                    let spaltenRaw = Array.from(infos.getElementsByTagName('font'));
                    let spalten = spaltenRaw.map(x => x.textContent.replace(/\n/g, ""));

                    const fach = spalten[0]; // GE3, E1, ...
                    const lehrer = spalten[1];
                    const raum = spalten[2];

                    raeume.push({
                        kurs: fach,
                        raum: raum
                    });


                    //
                    // test for existence in other week
                    //
                    let exists = false;
                    kurse[woche].kurse.forEach(function (kurs) {
                        if(fach === kurs.fach) exists = true;
                    });

                    if (!exists)
                        kurse[woche].kurse.push({
                            title: title,
                            fach: fach,
                            lehrer: lehrer
                        });

                }); // info

                stunde.push({
                    type: 'kurs',
                    fach: title,
                    isBig: doppelStunde,
                    raeume: raeume,
                    tag: tag - 1,
                    isUsed: isUsed
                });


            }
        }); // td
        if(stunde.length !== 0)
            data.push(stunde);

    }); // tr

    umdrehen(data, tempTTs, woche, stufe);

}


function umdrehen(data, tempTTs, woche, stufe) {
    let tt = {days: [[], [], [], [], []]};
    data.forEach(function (stundeE, stunde) {
        stundeE.forEach(function (timetableslot, untrustedtag) {
            let tts;
            let tag = timetableslot.tag;
            tag = (tag === undefined || tag === -1)? untrustedtag: tag;

            // get a free timetable slot
            while (typeof tt.days[tag][stunde] !== "undefined"){
                stunde++;
            }

            if (timetableslot.fach !== undefined ){
                tts = Object.assign({}, timetableslot);
                delete tts.isBig;
            }

            // add to TT
            // @ts-ignore
            if(tts === undefined) tts = {};
            tt.days[tag][stunde] = tts;
            // two times in case of isBig
            if (timetableslot.isBig) tt.days[tag][stunde + 1] = tts;
        })
    });


    tt.days.forEach(function (day, i) {
        let length = tt.days[i].length;
        for (let sub = 0; sub < length; sub++){
            if(!tt.days[i][length-sub]) delete tt.days[i][length-sub];
            else if (!tt.days[i][length-sub].type) delete tt.days[i][length-sub];
            else break;
        }
        // Pause vor 10/11 löschen
        if (tt.days[i][9])
            if (!tt.days[i][9].type)
                delete tt.days[i][9];
        tt.days[i] = day.filter(e=>e !== undefined);
    });

    // Add tt to TempTTs
    let setYet = false;

    tempTTs.forEach(function (val) {
        if (val.stufe !== stufe) return;
        val.tt[woche] = tt;
        setYet = true;
    });
    if(!setYet)
        tempTTs.push({
            stufe: stufe,
            tt: (woche === 0)? [tt]: [undefined, tt]
        });

}


module.exports = {getKurseAndTT}