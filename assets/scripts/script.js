/**
 * Created by Nicolas on 22/12/16.
 */
var socketUrl = "{{SOCKET_URL}}";

var socket = io.connect(socketUrl);
socket.on('news', function (data) {
    console.log(data);
    //socket.emit('other', {my: 'data'});
});

socket.on('httpEvent', function (data) {
    var item = '<li> <div class="collapsible-header"><i class="material-icons">whatshot</i>' + data.http.method + '</div> ';
    console.log(data.http.method);
    if (['POST','PUT'].indexOf(data.http.method)!=-1) {
        item += '<div class="collapsible-body"><p>' +
            JSON.stringify(data.http.body) +
            '</p></div>';
    }
    item += '</li>';
    $('#httpCallList').prepend(item);
});
