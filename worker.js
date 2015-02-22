"use strict";

var httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function(e)
{
	if (this.readyState === 4)
	{
		if (this.status === 200)
		{
			var data = JSON.parse(this.responseText)
			self.postMessage(data);
		}
		else
		{
			self.postMessage(this.status);
		}
	}
};

self.onmessage = function(e)
{
	var url = e.data;
	httpRequest.open('GET', url, true);
	httpRequest.send(null);
};