function doGet(e){

 // Change Spread Sheet url
 var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1e0KOmFXmVhXCeYTW9sXdr9cf8trt3-6Ct43PE9rgV3U/edit#gid=983940402");

// Sheet Name, Chnage Sheet1 to Users in Spread Sheet. Or any other name as you wish
 var sheet = ss.getSheetByName("Acc");
  
 return getProducts(sheet); 
  
}


function getProducts(sheet){
  var jo = {};
  var dataArray = [];

// collecting data from 2nd Row , 1st column to last row and last column
  var rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  
  for(var i = 0, l= rows.length; i<l ; i++){
    var dataRow = rows[i];
    var record = {};
    record['Acc_No'] = dataRow[0];
    record['Description'] = dataRow[1];
    record['Acc_Type'] = dataRow[2];
    record['Category'] = dataRow[3];

    dataArray.push(record);
    
  }  
  
  jo.data = dataArray;
  
  var result = JSON.stringify(jo);
  
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  
}  
