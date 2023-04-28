//SCRIPT FOR last20windspd.html

// Note that the same comments apply here as in script2.js. 

const rangeInput = document.querySelector('input[type="range"]');
const table = document.querySelector('table');
const tbody = table.querySelector('tbody');
const rangeLabel = document.querySelector('label') 

let periodResult = ''; 
const rangeText = ["NOW", "24 HOURS AGO", "48 HOURS AGO", "72 HOURS AGO", "WEEK AGO", "MONTH AGO"];
let data = [];


function fetchData() {
  const url = `https://webapi19sa-1.course.tamk.cloud/v1/weather/wind_speed${periodResult}`;
  fetch(url)
    .then(response => response.json())
    .then(response => {
      data = response;
      createTable();
      createChart(data);
      calculateStats(data);
    });
}

rangeInput.addEventListener('input', () => {
  const currentValue = rangeInput.value;
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
  rangeLabel.innerHTML = `Currently showing data from the following period: <strong>${rangeText[currentValue]}</strong>`;
  fetchData();
});


function createTable() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  for (const item of data) {
    const tr = createTableItem(item);
    tbody.appendChild(tr);
  }
}

function createTableItem(item) {
  const tr = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  const td3 = document.createElement('td');
  td1.textContent = (item.date_time).slice(0,10);
  td2.textContent = (item.date_time).slice(11,16);
  td3.textContent = item.wind_speed;
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  return tr;
}
let weatherChart;
function createChart(item){
  const chartContext = document.querySelector('canvas')
  const windspeed=item.map(x=>x.wind_speed);
  const date=item.map(x=>(x.date_time).slice(0,10));

  if (weatherChart) {
    weatherChart.data.labels = date;
    weatherChart.data.datasets[0].data = windspeed;
    weatherChart.update();
  } else {
    weatherChart=new Chart(chartContext,
      {
      type:"bar",
      data:
      {
        labels:date,
        datasets:
        [{
          label:"Wind speed",
          data:windspeed,backgroundColor:"black",
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
                  suggestedMax:30 // Y'all better hold onto your hats if the wind blows this hard..
                }
              }
            }  
       });
  }
}
function calculateStats(data) {
  const stringWindspd = data.map((item) => item.wind_speed);
  const floatWindspd=[];
  for (let i = 0; i < stringWindspd.length; i++) { 
    floatWindspd.push(parseFloat(stringWindspd[i]));
  }

  
  const mean = floatWindspd.reduce((a, b) => a + b, 0) / floatWindspd.length;

 
  const sortedWindspd = [...floatWindspd].sort();
  const middleIndex = Math.floor(sortedWindspd.length / 2);
  const median =
    sortedWindspd.length % 2 === 0
      ? (sortedWindspd[middleIndex] +
          sortedWindspd[middleIndex - 1]) /
        2
      : sortedWindspd[middleIndex];

  const counts = {};
  let mode = null;
  let maxCount = 0;
  for (const windspd of sortedWindspd) {
    counts[windspd] = (counts[windspd] || 0) + 1;
    if (counts[windspd] > maxCount) {
      mode = windspd;
      maxCount = counts[windspd];
    }
  }

  
  const range = Math.max(...floatWindspd) - Math.min(...floatWindspd);
  
  const meanDifferenceSquared = floatWindspd.map((winds) => (winds - mean) ** 2);
  const variance =
    meanDifferenceSquared.reduce((a, b) => a + b, 0) / meanDifferenceSquared.length;
  const standardDeviation = Math.sqrt(variance);

   
    document.getElementById("mean").innerHTML="Mean: <strong>"+mean.toFixed(2)+"</strong>";
    document.getElementById("median").innerHTML="Median: <strong>"+median.toFixed(2)+"</strong>";
    document.getElementById("mode").innerHTML="Mode: <strong>"+mode+"</strong>";
    document.getElementById("range").innerHTML="Range: <strong>"+range.toFixed(2)+"</strong>";
    document.getElementById("standard-deviation").innerHTML="Standard Deviation: <strong>"+standardDeviation.toFixed(2)+"</strong>";
}