"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatQuery = (value) => {
    let array = value.split("  ").map((str) => str.replace("\n", ""));
    array.splice(0, 2);
    array.splice(-1, 1);
    const indents = formatArray(array);
    let obj = {};
    for (let i = 0; i < indents.length; i++) {
        let indent = indents[i];
        if (indent.indent) {
            let endInx = indents
                .slice(i)
                .findIndex((item) => item.key === "}" && item.value === indent.value);
            let newArray = indents.splice(i, i + endInx);
            const results = arrToObj(newArray);
            obj = Object.assign(Object.assign({}, obj), { [indent.key]: Object.assign({}, results) });
        }
        else {
            obj = Object.assign(Object.assign({}, obj), { [indent.key]: true });
        }
    }
    return obj;
};
const formatArray = (array) => {
    const results = [];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element.length > 0) {
            let newEle = element.split(" ");
            if (newEle.length === 2) {
                results.push({
                    key: newEle[0],
                    value: getIndent(array.slice(0, i)),
                    indent: true,
                });
            }
            else {
                results.push({
                    key: element,
                    value: getIndent(array.slice(0, i)),
                    indent: false,
                });
            }
        }
    }
    return results
        .map((result) => (result.key === "__typename" ? false : result))
        .filter(Boolean);
};
const getIndent = (array) => {
    let rev = [...array.reverse()];
    const index = rev.findIndex((value) => value !== "");
    let num = index === -1 ? rev.length : rev.slice(0, index).length;
    return num;
};
const arrToObj = (array) => {
    let newArray = [...array];
    let obj = {};
    newArray.splice(0, 1);
    if (newArray[newArray.length - 1].key === "}")
        newArray.splice(newArray.length - 1, 1);
    for (let i = 0; i < newArray.length; i++) {
        const indent = newArray[i];
        if (indent.indent) {
            let endInx = newArray
                .slice(i)
                .findIndex((item) => item.key === "}" && item.value === indent.value);
            let array = newArray.splice(i, endInx);
            const results = arrToObj(array);
            obj = Object.assign(Object.assign({}, obj), { [indent.key]: Object.assign({}, results) });
        }
        else {
            obj = Object.assign(Object.assign({}, obj), { [indent.key]: true });
        }
    }
    return obj;
};
exports.default = formatQuery;
//# sourceMappingURL=formatQuery.js.map