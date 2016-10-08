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
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
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
                    popupAnchor: [25, 25]
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
                            iconSize: [10, 10],
                            popupAnchor: [5, 5]
                        })
                    })
                    //.addTo(map)
                    .bindPopup(data[i].property_address + '<br>' + data[i].name);

                markers.addLayer(m);
            }
            map.addLayer(markers);
        }

        worker.postMessage("https://data.detroitmi.gov/resource/nfx3-ihbp.json");
    };
};
