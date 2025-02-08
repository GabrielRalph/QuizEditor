/** 
 * @typedef {Object} IconInfo 
 *  @property {string} name
 *  @property {string} type
 *  @property {string} url
 *  @property {string} id
 *  @property {number} match
 */

/**
 * @typedef {Object} UploadResults
 * @property {boolean} valid
 * @property {string[]} errors
 * @property {string} symbolID
 * @property {string} url
 * @property {IconInfo[]} similar
 */

/**
 * @typedef {Object} DeleteResults
 * @property {boolean} success
 * @property {string[]} errors
 * @property {IconInfo[]} multiples
 */

import {onValue, callFunction, push, set, get, child, equalTo, getUID, onChildAdded, onChildChanged, onChildRemoved, orderByChild, query, ref, update, initialise as _init, startAfter, endBefore} from "./firebase-client.js"

async function toBufferString(file) {
    let arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result)
        };
        reader.readAsArrayBuffer(file);
    })

    var binary = '';
    var bytes = new Uint8Array( arrayBuffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    
    return window.btoa(binary);
}

/** Uploads a grid symbols provided as a file.
 * @async 
 * @param {File} file
 * @param {name} string
 * @param {pub} pub is public
 * @param {(percentage: number, status: number) => void} cb progress callback
 * 
 * @return {Promise<UploadResults>}
 */
export async function uploadSymbol(file, name, pub, cb) {
    let type = file.type;
    let dataBuffer = await toBufferString(file);

    let uploadID = (new Date()).getTime() + "id";

    console.log("uploading", name, dataBuffer.length, uploadID);
    
    // watch file status
    let end = onValue(ref(`file-status/${getUID()}`), (snap) => {
        let data = snap.val();
        if (data) {
            let matches = Object.values(data).filter(val => val.id == uploadID);
            if (matches.length > 0) {
                let res = matches[0];
                cb(res.status / 4, res.status)
                if (res.status == 4) {
                    end();
                }
            }
        }
    })

    let res = await callFunction("gridSymbols-upload", {dataBuffer,public:pub,name,type,uploadID});
    return res.data;
}

/** Deletes a grid symbols based its name or ID.
 * @async
 * @param {string} value 
 * @param {("id"|"name")} type
 * 
 * @return {Promise<DeleteResults>}
 */
export async function deleteSymbol(value, type) {
    if (type == "id" || type == "name") {
        let res = await callFunction("gridSymbols-delete", {value, type});
        return res.data;
    } else {
        throw "invalid delete type."
    }
}

/** Searches for grid symbols based on search phrase.
 * @async
 * @param {string} text search phrase
 * @param {("user"|"public"|"all")} mode the mode to search from
 * @param {("vector"|"text"|"both")} type the search method to use
 * 
 * @return {Promise<IconInfo[]>}
 */
export async function searchSymbols(text, mode = "all", type = "both"){
  let results = await callFunction("gridSymbols-search", {text, mode: mode, type: type});
  return results.data;
}
