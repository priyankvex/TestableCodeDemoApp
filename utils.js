function dateToISOString(date){
    return date.toISOString();
}

function ISOStringToDate(ISOString){
    return new Date(ISOString);
}

module.exports = {
  dateToISOString: dateToISOString,
  ISOStringToDate: ISOStringToDate
};
