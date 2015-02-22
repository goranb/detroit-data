"use strict";

var Data;

window.onload = function(e)
{
	Data = new function()
	{
		console.log('?');
		var worker = new Worker('worker.js');

		var map = L.map('map', {
	    	center: [42.331389, -83.045833],
	    	zoom: 12
		});

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		worker.onmessage = function(e)
		{
			var data = e.data;

			for (var i in data)
			{
				L.marker([data[i].location.latitude, data[i].location.longitude], {
						riseOnHover: true
					})
					.addTo(map)
	    			.bindPopup(data[i].property_address + '<br>' + data[i].name);
			}
		}

		worker.postMessage("https://data.detroitmi.gov/resource/3t7p-zq9t.json");
	};
};