$(document).ready(function () {
    var searchInput = $('#searchInp');
    var searchButton = $('#searchBtn');
    var APIKEY = '200624582-ef03dfcbf90f2bd9243bdef3d1acb99b';
    searchButton.click(function (e) {
        e.preventDefault();
        var address = searchInput.val();
        var geoCodeApi = {
            "async": true,
            "crossDomain": true,
            "url": `https://devru-latitude-longitude-find-v1.p.rapidapi.com/latlon.php?location=${address}`,
            "method": "GET",
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "x-rapidapi-host": "devru-latitude-longitude-find-v1.p.rapidapi.com",
                "x-rapidapi-key": "4fbf5f804emshb740f6dffabc9b7p106402jsnf97c633c941b"
            }
        }
        $.ajax(geoCodeApi).done(function (response) {
            console.log({ geoAPI: response });
            console.log("lat " + response.Results[0].lat + "long " + response.Results[0].lon)
            var LATITUDE = response.Results[0].lat;
            var LONGITUDE = response.Results[0].lon;
            var queryURL = `https://www.hikingproject.com/data/get-trails?lat=${LATITUDE}&lon=${LONGITUDE}&key=${APIKEY}&minStars=4&minLength=10`;
            console.log(queryURL);
            var settings = {
                "url": queryURL,
                "method": "GET",
            }
            $.ajax(settings).done(function (result) {
                console.log(result);
                var trails = result.trails;
                // console.log(trails.length)
                for (var i = 0; i < 5; i++) {
                    var resultsDiv = $("<div>");
                    var rating = $("<p>").text("Star rating: " + trails[i].starVotes);
                    var difficulty = $("<p>").text("difficulty: " + trails[i].difficulty);
                    var image = $("<img>");
                    image.attr("src", trails[i].imgMedium);
                    resultsDiv.append(image);
                    resultsDiv.append(rating);
                    resultsDiv.append(difficulty);
                    $(".results").append(resultsDiv);
                }
            });
        });
    });
});