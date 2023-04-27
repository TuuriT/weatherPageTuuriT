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