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
    var update2 = {
      x:  [new_data.ts],
      y: [new_data.rs]
    };
    
    Plotly.extendTraces(psi_graph, update, [0]);
    Plotly.extendTraces(psi_graph, update2, [1]);
    $(function () {
      $('#psi').text(psi_graph.data[0].y[psi_graph.data[0].y.length -1].toString()+" psia");
      $('#rate').text(psi_graph.data[1].y[psi_graph.data[1].y.length -1].toString()+" bpm");
    });
  })
//Plotly
psi_graph = document.getElementById('psiGraph');

var trace1 = {
  x: [timeStamp],
  y: [pressure],
  mode: 'lines',
  name: 'Pressure',
  line: {color: 'red'}
};

var trace2 = {
  x: [timeStamp],
  y: [rate],
  name: 'Rate',
  mode: 'lines',
  line: {color: '#184787'},
  yaxis: 'y2'
};


var data = [trace1, trace2];

var layout = {
  title: 'DFIT',
  yaxis: {
      title: 'Pressure(psia)',
      titlefont: {color: 'red'},
      tickfont: {color: 'red'}
  },
  yaxis2: {
    title: 'Rate(bpm)',
    titlefont: {color: '#184787'},
    tickfont: {color: '#184787'},
    overlaying: 'y',
    side: 'right'
  }
};


Plotly.plot(psi_graph, data, layout);


//var press = psi_graph.data[0];
//var psia = press.y[press.y.length -1];


/*$(function () {
      $('#psi').text(psi_graph.data[0].y[psi_graph.data[0].y.length -1].toString()+" psia");
    });*/
