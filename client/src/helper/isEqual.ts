const isEqual = (a: any,b: any) => {
    let newA = JSON.stringify(a),
        newB = JSON.stringify(b);

    if(newA === newB) {
        return true
    }

    return false
}
export default isEqual;