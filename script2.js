//SCRIPT FOR last20temp.html


const rangeInput = document.querySelector('input[type="range"]'); //automatically finds first range input type element.
const table = document.querySelector('table');// same logic applies here
const tbody = table.querySelector('tbody');// and here.
const rangeLabel = document.querySelector('label') // aaaaand here.


let periodResult = ''; //default/starting value.
const rangeText = ["NOW", "24 HOURS AGO", "48 HOURS AGO", "72 HOURS AGO", "WEEK AGO", "MONTH AGO"]; //cool names in array. Used to tell the user what data is currently being presented.
let data = []; //Response storage.

//Data fetching.
function fetchData() {
  const url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature${periodResult}`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      data = response;
      createTable();
      createChart(data);
    });
}
//Input listening. 
rangeInput.addEventListener('input', () => {
  const currentValue = rangeInput.value; //currentValue holds the current value of the slider (As the name gives away. The range is 0-5.)
  if (currentValue == 0) {
    periodResult = '';
  } else if(currentValue==1){
    periodResult="/24";
  } else if(currentValue==2){
    periodResult="/48";
  } else if(currentValue==3){
    periodResult="/72";
  } else if(currentValue==4){
    periodResult="/1week";
  } else if(currentValue==5){
    periodResult="/1month";
  }
  rangeLabel.innerHTML = `Currently showing data from the following period: <strong>${rangeText[currentValue]}</strong>`; //used to import and display the previously mentioned cool names in array.
  fetchData(); //when the value for "periodResult" has been set, call the fetchData() -function.
});

//logic used to create children AND to remove unwanted/excessive children from the table. (that sounds really wrong.)
function createTable() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild); //While children exists the children are removed, one by one, until there's none left......
  }
  for (const item of data) {
    const tr = createTableItem(item); //The retrun of the Children
    tbody.appendChild(tr);
  }
}
//Table element creation.
function createTableItem(item) {
  const tr = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  td1.textContent = (item.date_time).slice(0,10);
  td2.textContent = (item.date_time).slice(11,16);
  td3.textContent = item.temperature;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  return tr;
}

//Chart creation.
let weatherChart; // declaring the chart variable outside the function to be able to update it later.
function createChart(item){
  const chartContext = document.querySelector('canvas') //The "auto select" logic applies here too, who would've thought??
  const temp=item.map(x=>x.temperature); //Configuring the data to fit the chart: temperature.
  const date=item.map(x=>(x.date_time).slice(0,10)); //Same here, but with dates.

  if (weatherChart) { // if the chart already exists, update its data.
    weatherChart.data.labels = date;
    weatherChart.data.datasets[0].data = temp;
    weatherChart.update();
  } else { // if the chart doesn't exist, create it.
    weatherChart=new Chart(chartContext,
      {
      type:"bar",
      data:
      {
        labels:date,
        datasets:
        [{
          label:"Temperature",
          data:temp,backgroundColor:"black",
          borderColor:"grey",
          borderWidth:2
         },
        ]},
             options:
             {
              scales:
              {
                y:
                {
                  suggestedMin:-20, //despite the negative effects of global warming, negative temperatures can still be achieved in Tampere.
                  suggestedMax:30 //Imma just put 30 as a limit, going over this makes me feel uncomfortable..
                }
              }
            }  
       });
  }
}