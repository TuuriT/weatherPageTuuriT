//SCRIPT FOR last20temp.html

const rangeInput = document.querySelector('input[type="range"]'); //automatically finds first range input type element.
const table = document.querySelector('table');// same logic applies here
const tbody = table.querySelector('tbody');// and here.
const rangeLabel = document.querySelector('label') // aaaaand here.


let periodResult = ''; //default/starting value.
const rangeText = ["NOW", "24 HOURS AGO", "48 HOURS AGO", "72 HOURS AGO", "WEEK AGO", "MONTH AGO"]; //cool names in array. Used to tell the user what data is currently being presented.
let data = []; //Response storage. The data stored here is used to manipulate the table elements.

//Data fetching.
function fetchData() {
  const url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/temperature${periodResult}`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      data = response;
      createTable();
      createChart(data);
      calculateStats(data);
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
    tbody.removeChild(tbody.firstChild); //While children exists the children are removed, one by one, until there's none left...
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


//Statistic calculation.
function calculateStats(data) {
  const stringTemperatures = data.map((item) => item.temperature); //creating array "temperatures. Holds all given temp. values IN STING FORMAT (depends on the API call)"
  const floatTemperatures=[];
  for (let i = 0; i < stringTemperatures.length; i++) { //this code converts the array into usable form.
    floatTemperatures.push(parseFloat(stringTemperatures[i]));
  }

  //calculate mean.
  const mean = floatTemperatures.reduce((a, b) => a + b, 0) / floatTemperatures.length;

  // Calculate median
  const sortedTemperatures = [...floatTemperatures].sort();
  const middleIndex = Math.floor(sortedTemperatures.length / 2);
  const median =
    sortedTemperatures.length % 2 === 0
      ? (sortedTemperatures[middleIndex] +
          sortedTemperatures[middleIndex - 1]) /
        2
      : sortedTemperatures[middleIndex];

  // Calculate mode
  const counts = {};
  let mode = null;
  let maxCount = 0;
  for (const temperature of sortedTemperatures) {
    counts[temperature] = (counts[temperature] || 0) + 1;
    if (counts[temperature] > maxCount) {
      mode = temperature;
      maxCount = counts[temperature];
    }
  }

  // Calculate range
  const range = Math.max(...floatTemperatures) - Math.min(...floatTemperatures);

  // Calculate standard deviation
  const meanDifferenceSquared = floatTemperatures.map((temp) => (temp - mean) ** 2);
  const variance =
    meanDifferenceSquared.reduce((a, b) => a + b, 0) / meanDifferenceSquared.length;
  const standardDeviation = Math.sqrt(variance);

   //Set the elements with correct values.
    document.getElementById("mean").innerHTML="Mean: <strong>"+mean.toFixed(2)+"</strong>";
    document.getElementById("median").innerHTML="Median: <strong>"+median.toFixed(2)+"</strong>";
    document.getElementById("mode").innerHTML="Mode: <strong>"+mode+"</strong>";
    document.getElementById("range").innerHTML="Range: <strong>"+range.toFixed(2)+"</strong>";
    document.getElementById("standard-deviation").innerHTML="Standard Deviation: <strong>"+standardDeviation.toFixed(2)+"</strong>";
}