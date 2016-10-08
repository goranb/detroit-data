"use strict";

var Data;

window.onload = function(e)
{
    Data = new function()
    {
        var worker = new Worker('worker.js');

        var map = L.map('map', {
            center: [42.361389, -83.045833],
            zoom: 12
        });
        
        L.tileLayer('//stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }).addTo(map);

        worker.onmessage = function(e)
        {
            var data = e.data;

            for (var d of data)
            {
                var m = L.marker([d.latitude, d.longitude], {
                        icon: new L.DivIcon({
                            className: 'icon',
                            iconSize: [10, 10],
                            popupAnchor: [5, 5]
                        })
                    })
                    .addTo(map)
                    .bindPopup(d.address+ '<br>' + d.contractor_name + '<br>$' + parseFloat(d.price).toFixed(2));

            }
        }

        worker.postMessage("https://data.detroitmi.gov/resource/nfx3-ihbp.json");
    };
};
