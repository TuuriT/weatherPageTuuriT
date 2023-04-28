// FOR last50.html
//this code is heavily influenced from the GoT - API challenge.
createTableItem = (item) => {
    let tableItem = document.createElement('tr');
    tableItem.className = 'table-record';

    let tableDataDate = document.createElement('td');
    tableDataDate.innerText=(item.date_time).slice(0,10);
    tableItem.append(tableDataDate);

    let tableDataTime = document.createElement('td');
    tableDataTime.innerText=(item.date_time).slice(11,16);
    tableItem.append(tableDataTime);
  
    let tableDataValue=document.createElement('td');
    tableDataValue.innerText=Object.keys( item.data )+" : "+Object.values(item.data);
    tableItem.append(tableDataValue);
  
    return tableItem;
  }
 fetch50=async()=>{
    let tableRecord = document.getElementById('table-record');
    try{
        const response=await fetch('https://webapi19sa-1.course.tamk.cloud/v1/weather/limit/50');
        if (!response.ok) {
            throw new Error(response.statusText);
          };

        const data=await response.json();
        
        data.map((item)=>{
            const tableItem = createTableItem(item);
            tableRecord.append(tableItem);
        });
    }
    catch(error){
        console.log(error);
    }
}   
fetch50();
