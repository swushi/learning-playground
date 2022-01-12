"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function query() {
    let count = 0;
    return {
        hello: function () {
            console.log('hello', count);
            count++;
            return this;
        }
    };
}
exports.default = query;
query().hello().hello().hello();
