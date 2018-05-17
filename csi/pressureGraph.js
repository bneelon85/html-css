//Connect to Websocket
  var exampleSocket = new WebSocket("ws://96.95.233.114:80/4826DFITsimple/",["com.campbellsci.webdata"]);
  
  exampleSocket.addEventListener('open', function (event) {
    console.log('Hello Server!');
    exampleSocket.send('{"message":"AddRequests","requests":[{"uri":"Server:4826i.Data","mode":"since-time","p1":"2018-04-26T11:30:00","transaction":1,"order":"collected"}]}');
  });
//Create Arrays to Store data in  
var timeStamp = [];
var pressure = [];  
var rate = [];
//Function to extract data from JSON messages and append to arrays
function extractData (message)  {
    var ts = [];
    var ps = [];
    var rs = [];
    message.forEach(function(element) {
        ts.push(element.time);
        ps.push(element.vals[2]);
        rs.push(element.vals[4]);
    });
    
    return {ts: ts, ps: ps, rs: rs};
};
//On Message, append data to the plot
exampleSocket.addEventListener('message', function (mEvent) {

     var new_data = extractData(JSON.parse(mEvent.data).records.data);
     //console.log(JSON.parse(mEvent.data).records.data);
     console.log(new_data);
     var update = {
      x:  [new_data.ts],
      y: [new_data.ps]
      
    };
    
    Plotly.extendTraces(psi_graph, update, [0]);
  })
//Plotly
psi_graph = document.getElementById('psiGraph');

var data = [{
  x: [timeStamp],
  y: [pressure],
  mode: 'lines',
  line: {color: 'red'}
}
/*, {
  x: [timeStamp],
  y: [rate],
  mode: 'lines',
  line: {color: 'blue'},
  yaxis: 'y2'
}*/]


Plotly.plot(psi_graph, data);

//var cnt = 0;

//var interval = setInterval(function() {
    
  
//if(cnt === 100) clearInterval(interval);
//}, 1000);

