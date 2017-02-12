var express = require('express');
var router = express.Router();
var rp = require("request-promise");
var temp = require('x2x').temperature;

const WEATHER_URL = "https://api.darksky.net/forecast/";
const WEATHER_URL_QUERY_OPTIONS = "?";
const API_KEY = process.env.DARKSKY_API_KEY;

/**
 * GET forecast
 * 
 * This API method defers a forecast request to the DarkSky.net web service,
 * presenting the resulting data in a way that allows the single-page web
 * application to consume it.
 */
router.get('/:latlong/hourly', function(req, res, next) {
    let latlong = req.params.latlong;
    let lat = parseFloat(latlong.split(',')[0]);
    let long = parseFloat(latlong.split(',')[1]);
    let requestUri = WEATHER_URL;

    // Short-circuit on invalid coordinates or missing API key.
    if (isNaN(lat)) return next(new Error("Invalid latitude."));
    if (isNaN(long)) return next(new Error("Invalid longitude."));
    if (API_KEY === undefined) return next(new Error("API KEY not defined."));

    // Re-construct our latlong now that we've verified its format.
    latlong = lat + ',' + long;

    // Form our DarkSky GET request URI
    requestUri += [API_KEY, latlong].join('/');
    weatherRequest = {
        uri: requestUri,
        qs: {
            'exclude': 'minutely,daily,alerts,flags'
        },
        json: true
    };

    rp(weatherRequest)
        .then(function(weatherData) {
            // Construct a JSON object that relates the data we're consuming
            // (discarding the rest).
            let outputJson = {
                latitude: weatherData.latitude,
                longitude: weatherData.longitude,
                currently: {
                    time:  weatherData.currently.time,
                    temperature: temp.f2c(weatherData.currently.temprature)
                },
                hourly: weatherData.hourly.data.map(hourDataPoint => {
                    return {
                        "time": hourDataPoint.time,
                        "temperature": temp.f2c(hourDataPoint.temperature)
                    }
                })
            }
            res.send(outputJson);
        })
        .catch(function(error) {
            next(error);
        });

});

module.exports = router;
