"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hashGenerator;
function hashGenerator(len) {
    let options = "ncsdkhusfojfofhonnadiojaSNNOIODFJJNDOSOIAPQPOCNII";
    const length = options.length;
    let ans = "";
    for (let i = 0; i < len; i++) {
        ans += options[(Math.floor(Math.random() * length))];
    }
    return ans;
}
