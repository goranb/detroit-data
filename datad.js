"use strict";

var Data;

window.onload = function(e)
{
    Data = new function()
    {
        var worker = new Worker('worker.js');

        var map = L.map('map', {
            center: [42.331389, -83.045833],
            zoom: 12
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        var markers = new L.MarkerClusterGroup({
            removeOutsideVisibleBounds: true,
            iconCreateFunction: function(cluster)
            {
                var level = Math.floor(cluster.getChildCount() / 10);
                if (level > 10)
                {
                    level = 10;
                }
                return new L.DivIcon({
                    className: 'icon cluster-icon cluster-icon-' + level,
                    html: '<span class="label">' + cluster.getChildCount() + '</span>',
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, 0]
                });
            }
        });

        worker.onmessage = function(e)
        {
            var data = e.data;

            for (var i in data)
            {
                var m = L.marker([data[i].location.latitude, data[i].location.longitude], {
                        icon: new L.DivIcon({
                            className: 'icon',
                            iconSize: [10, 10]
                        })
                    })
                    //.addTo(map)
                    .bindPopup(data[i].property_address + '<br>' + data[i].name);

                markers.addLayer(m);
            }
            map.addLayer(markers);
        }

        worker.postMessage("https://data.detroitmi.gov/resource/3t7p-zq9t.json");
    };
};