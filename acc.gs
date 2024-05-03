function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ws = ss.getSheetByName('Customers');
  const data = ws.getRange("A1").getDataRegion().getValues();
  const headers = data.shift();

  //[{id:3, firstName: "Semok"}, {}]

  const jsonArray = data.map(r => { 
    let obj = {};
    headers.forEach((h,i) => {
      obj[h] = r[i];
    });
    return obj;
  });

  // const response = [{status: 200, data: jsonArray}];
   const response = [{data: jsonArray}];


  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
  //return sendJSON_(response);
}


function doPost(e){
   // { "name" : "Joe" }
   // {"first":"Monica","last":"Zapata","phone":"620-960-9347"}

   let jsonResponse;

   const ss = SpreadsheetApp.getActivitySpreadsheet();
   const ws = ss.getSheetByName('Customers');
   //const aoaIds = ws.getRange(2,1,ws.getLastRow(),1).getValues();
   const headers = ws.getRange(1,1,1,ws.getLastColumn()).getValues()[0];
   const headersOriginalOrder = headers.slice(); 
   headersOriginalOrder.shift();
  //remove id column header
   headers.shift();
   headers.sort();

   const body = e.postData.contents;
   const bodyJSON = JSON.parse(body);
   const headersPassed = Object.keys(bodyJSON).sort();

   if(!compareTwoArray_(headers,headersPassed)){
     jsonResponse = {status:500,message: "Invalid Argument Passed"};
     return sendJSON_(response);
   }

   const arrayOfData = headersOriginalOrder.map(h => bodyJSON[h]);

   const aoaIds = ws.getRange(2,1,ws.getLastRow(),1).getValues();
   const newIdNumber = getMaxFromArrayOfArray_(aoaIds) + 1;
   arrayOfData.unshift(newIdNumber);

   //ws.appendRow([bodyJSON.name]);
   ws.appendRow(arrayOfData);

  return ContentService
    .createTextOutput(JSON.stringify(jsonResponse))
    .setMimeType(ContentService.MimeType.JSON);

} 

//Return true if all item are the same
function compareTwoArray_(arr1,arr2){

  if(arr1.length !== arr2.length) return false;

   for(let i = 0; i < arr1.length;i++) {
     if(arr1[i] !== arr2[i]) return false;
   }
    return true;
}


function sendJSON_(jsonResponse) {
  ContentService
   .createTextOutput(JSON.stringify(jsonResponse))
   .setMimeType(ContentService.MimeType.JSON);

}

//return the highest number / id
function getMaxFromArrayOfArray_(aoa) {
   let maxID = 0;
   aoa.forEach(r => {
     if(r[0] > maxID) maxID = r[0];
  });
   return maxID;
}
