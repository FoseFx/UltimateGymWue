const fetch = require("node-fetch");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const START_FILE = "subst_001.htm";
const VERT_URL_S = "https://gymnasium-wuerselen.de/untis/Schueler/";
const VERT_URL_L = "https://gymnasium-wuerselen.de/untis/Lehrer/";

function fetchWithCreds(url, creds) {
    return fetch(url, {
        headers: {
            "User-Agent": "UGW Bot",
            "Authorization": `Basic ${creds}`
        }
    });
}

function getVertretungsdaten(creds, useLehrer, date) {
    const expectedDate = date.getDate() + "." + (date.getMonth() + 1) + ".";

    //if(useLehrer) return _getLehrerVertretungsDaten(creds.l, expectedDate);
    //else
    return _getSchuelerVertretungsDaten(creds, expectedDate);
}

function _getSchuelerVertretungsDaten(creds, expectedDate){
    return fetchVD(creds, expectedDate);
}


async function fetchVD(creds, expectedDate, lehrer = false) {
    let frames = await Promise.all([
        fetchVDFrame(creds, "f1/", expectedDate, lehrer, START_FILE, []),
        fetchVDFrame(creds, "f2/", expectedDate, lehrer, START_FILE, [])
    ]);
    let frame1 = [frames[0][0], null];
    let frame2 = [null, frames[1][0]];
    let anal1 = analyzeVD(frame1);
    let anal2 = analyzeVD(frame2);
    anal1[0].unshift(frames[0][1]);
    anal2[0].unshift(frames[1][1]);
    return [anal1, anal2];
}

/**
 * @returns VertretungsDaten: This frames Date
 * @returns Null            : This frame is old
 * */
async function fetchVDFrame(creds,
                                   frame,
                                   expectedDate,
                                   lehrer,
                                   file,
                                   slides
) {
    const resp = await fetchWithCreds(lehrer? VERT_URL_L:VERT_URL_S + frame + file, creds, true);
    console.log(resp);
    if (!resp.ok) throw new Error("Netzwerkfehler: " + resp.statusCode);
    const text = await resp.textConverted();
    const dom = new JSDOM(text);
    const doc = dom.window.document;
    // test whether this frame is old
    const tagOnDoc = doc.querySelector(".mon_title").textContent.trim().split(" ")[0];
    //if (tagOnDoc.match(expectedDate) === null)
    //    return null;
    const eva = evaVDPort(text, false);
    file = eva[0];
    slides.push(eva[1]);
    if(file === START_FILE) return [slides, tagOnDoc];
    return fetchVDFrame(creds, frame, expectedDate, lehrer, file, slides);

}

function analyzeVD(frames){
    if(frames.length !== 2) throw new Error("expected:  analyzeVD([frame1, frame2]), but got length of " + frames.length);
    // remove the one empty frame
    const frame = (frames[0] !== null) ? frames[0]: frames[1];
    if(frame === null) return null; // None of them have content
    let info = [];
    let stufenObj = {};

    frame.forEach(function (slide) {
        const infoArray = slide[1];
        info = info.concat(infoArray);

        slide[0].forEach(function (stufeCntent) {
            const stufe = stufeCntent.stufe;
            const content = stufeCntent.cntnd;

            if(!stufenObj[stufe])
                stufenObj[stufe] = content;
            else
                stufenObj[stufe] = stufenObj[stufe].concat(content);
        });
    });

    return [info, stufenObj];

}



const SACONDITION = ['selbstständiges arbeiten', "selbständiges arbeiten", "selbstständies arbeiten", "selbstäniges arbeiten", "eigenständiges arbeiten"];
const VARTEN =      ['entfall', 'vertretung', 'stattvertretung', 'statt-vertretung', 'raumvtr', 'klausur', "absenz"];
const VABKUERZUNG = ['e',       'v',            'statt-v',        'statt-v',         'r',        'k',       'fehlt'];
const VABKSPOKEN = ["Entfall", "Vertretung", "Statt Vertretung", "Statt Vertretung", "Raumvertretung", "Klausur", "noch nicht Klar"];

function typeAbkuerzen(type, infotext){
  let sa = infotext.includes('SELBST. ARB.');
  let index = VARTEN.findIndex(art=>art===type);
  if(index === -1 && !sa) return type;
  return sa? 'e (v)' : VABKUERZUNG[index];
}




 function evaVDPort(html, lehrer) {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let stufen = [];

    /*
        [0]: next File (e.g. "subst_001.html")
        [1]: Payload
    */
    let returnArray = [
        doc.querySelector('meta[http-equiv="refresh"]').content.split("URL=")[1],
        undefined
    ];

    doc.querySelectorAll("tr.list.odd,tr.list.even").forEach(function (zeile) {
        const children = zeile.children;
        if(children.length === 0) return;

        const firstChild = zeile.firstChild;

        // 'inline_header' is the classname of the td that indicates a new Stufe
        if(/( |^)inline_header( |$)/.test(firstChild.className)) {
            stufen.push({
                stufe: firstChild.textContent.split(' ')[0],
                cntnd: []
            });
            return;
        }

        let date = "";
        let oldroom = !lehrer? children[4].textContent.trim().replace(/\s/g, ""): '?';
        let klasse;
        let stundenstr = children[1].textContent.trim().replace(/\s/g, "");
        let stunden = stundenstr.split("-"); // [1, 2]
        let fach = children[lehrer?3:2].textContent.trim();
        let type = children[lehrer? 6:3].textContent.trim().replace(/\s/g, "").toLowerCase();
        let newroom = children[lehrer?4:5].textContent.trim().replace(/\s/g, "");
        let infotext = children[lehrer?7:6].textContent.trim().replace('\u00a0', '');

        SACONDITION.forEach(cond => {
            infotext = infotext.toUpperCase().replace(cond.toUpperCase(), 'SELBST. ARB.');
        });

        infotext = infotext.replace('AUFGABEN', 'AUFG.');
        type = typeAbkuerzen(type, infotext);

        if (!lehrer){
            date = children[0].textContent.trim().replace(/\s/g, "");
        }else{
            ((doc.getElementsByClassName('mon_title')[0])).textContent.trim().split('.').forEach((value, index, array) => {
                if(index === array.length -1) return;
                date += value.replace(" ", "") + ".";
            });
            klasse = children[2].textContent.trim().replace(/\s/g, "");
        }
        let pushObj = {
            type: type,
            date: date,
            fach: fach,
            oldRaum: oldroom,
            newRaum: newroom,
            info: infotext,
        };
        if(lehrer){
            pushObj.stufe = klasse;
        }
        stunden.forEach((stunde, i, array) => {
            let obj = Object.assign({}, pushObj);
            obj.stunde = stunde;
            stufen[stufen.length - 1].cntnd.push(obj);

            if (i === (array.length - 1)) {
                let alls = "";
                array.forEach((ts, ind) => {
                    alls += ts + (ind<array.length-1?" - ":"");
                });
                obj = Object.assign({}, pushObj);
                obj.stunde = alls;
                obj.nd = 1;
                stufen[stufen.length - 1].cntnd.push(obj);
            }
        });

    });

    let infoBox = [];
    Array.from(doc.querySelectorAll('tr.info')).forEach(function (inforow, i) {
        Array.from(inforow.children).forEach((child)=>{
            if(child.tagName.toLowerCase() === "th" ||
                child.parentElement.childElementCount !== 1 &&
                i === 1){
                infoBox.push('<b>' + child.textContent.trim() + '</b>')
            }else{
                infoBox.push(child.textContent.trim());
            }
        })
    });
    returnArray[1] = [stufen, infoBox];
    return returnArray;

}




module.exports = {getVertretungsdaten};