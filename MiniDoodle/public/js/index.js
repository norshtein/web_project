var renderPage = function(divid, jsonObject) {
    var selector = "#" + divid + "result";
    var html = '';
    $(selector).html("");

    if (jsonObject.preview != null) {
        html += '<div class="panel panel-default">';
        html += '    <div class = "panel-heading">The Result Set is too large,it has ' + jsonObject.count + ' items,only 100 items are shown,you can view full data at ' + '<a href="' + jsonObject.url + '">Download</a>' + '.</div>';
        jsonObject = jsonObject.preview;
    } else {

        html += '<div class="panel panel-default">';
        html += '    <div class = "panel-heading">Search Result</div>';
    }
    html += '    <table class="table">';
    html += '        <thead>';
    html += '            <tr>';
    html += '                <th>Movie name</th>';
    html += '                <th>Directors</th>';
    html += '                <th>Staring actors</th>';
    html += '                <th>Supporting actors</th>';
    html += '                <th>Genres</th>';
    html += '                <th>Year</th>';
    html += '                <th>Month</th>';
    html += '                <th>Day</th>';
    html += '                <th>Detailed Information</th>';
    html += '            </tr>';
    html += '        </thead>';
    html += '        <tbody>';

    $.each(jsonObject,function(index, movie) {
        html += '<tr>';

        html += '<td>';
        html += movie.moviename;
        html += '</td>';

        html += '<td>';
        html += movie.directors;
        html += '</td>';

        html += '<td>';
        html += movie.staringactors;
        html += '</td>';

        html += '<td>';
        html += movie.supportingactors;
        html += '</td>';

        html += '<td>';
        html += movie.genres;
        html += '</td>';

        html += '<td>';
        html += movie.year;
        html += '</td>';

        html += '<td>';
        html += movie.month;
        html += '</td>';

        html += '<td>';
        html += movie.day;
        html += '</td>';

        html += '<td>';
        html += '<a href="https://www.amazon.com/dp/' + movie.ASIN + '">' + movie.moviename + '</a>';
        html += '</td>';

        html += '</tr>';
    });
    html += '        </tbody>';
    html += '    </table>';
    html += '</div>';

    $(selector).append(html);
}

$("#timebutton").bind("click",
function() {
    var formdata = {};
    if ($("#year").val() != -1) formdata.year = $("#year").val();
    if ($("#month").val() != -1) formdata.month = $("#month").val();
    if ($("#season").val() != -1) formdata.season = $("#season").val();
    if ($("#weekday").val() != -1) formdata.weekday = $("#weekday").val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/time",
        data: formdata,
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("time", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#tagbutton").bind("click",function () {
   var tags = $("#tagset").val();
   var mask = 0;
   for(var i = 0;i < tags.length;i++)
       mask += 1 << tags[i];

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/tag",
        data: {
            "mask":mask
        },
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("tag", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#movienamebutton").bind("click",function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/moviename",
        data: {
            "moviename":$("#movienametext").val()
        },
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("moviename", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#directorbutton").bind("click",function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/director",
        data: {
            "director":$("#directortext").val()
        },
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("director", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#staringactorbutton").bind("click",function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/staractor",
        data: {
            "starringactor":$("#staringactortext").val()
        },
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("staringactor", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#supportactorbutton").bind("click",function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/supportactor",
        data: {
            "supportactor":$("#supportactortext").val()
        },
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("supportactor", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})

$("#combinebutton").bind("click",function () {
    var formdata = {};
    if ($("#cyear").val() != -1) formdata.year = $("#cyear").val();
    if ($("#cmonth").val() != -1) formdata.month = $("#cmonth").val();
    if ($("#cseason").val() != -1) formdata.season = $("#cseason").val();
    if ($("#cweekday").val() != -1) formdata.weekday = $("#cweekday").val();

    var tags = $("#ctagset").val();
    if(tags.length)
    {
        var mask = 0;
        for(var i = 0;i < tags.length;i++)
            mask += 1 << tags[i];
        formdata.mask = mask;
    }

    if($("#cmovienametext").val().length)
        formdata.moviename = $("#cmovienametext").val();
    if($("#cdirectortext").val().length)
        formdata.directorname = $("#cdirectortext").val();
    if($("#cstaringactortext").val().length)
        formdata.starringactor = $("#cstaringactortext").val();
    if($("#csupportactortext").val().length)
        formdata.supportactor = $("#csupportactortext").val();

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/combine",
        data: formdata,
        dataType: "json",
        crossDomain: true,
        success: function(response) {
            renderPage("combine", response);
        },
        fail: function(response) {
            alert("failed");
        }
    })
})