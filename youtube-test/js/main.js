var button;
var comments;
var inputVideo;
var numberOfComments;
let endpoint;
const API_KEY = 'AIzaSyB08HhWez-HeHNcDE3gcsRlUUac8hXXYRE';
let videoId;
// const VIDEO_ID = 'JOdsk78IjR0';

var cache = function () {
    button = $('#cta');
    comments = $('#comments');
    inputVideo = $('#videoId');
    numberOfComments = $('#numberOfComments');
};

var setup = function () {

};

var bind = function () {
    button.on('click', getComments);
    numberOfComments.on('change', getComments);
};

var youtubeParser = function(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

var getComments = function () {
    comments.html('');
    videoId = youtubeParser(inputVideo.val());
    // inputVideo.val().split('=')[1];
    endpoint = 'https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&key=' + API_KEY + '&videoId=' + videoId + '&maxResults=' + numberOfComments.val();

    // var patt = new RegExp('/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/');
    var isValid = videoId; //patt.test(inputVideo.val())
    
    if (inputVideo.val() !== '' && numberOfComments.val() !== '' && isValid) {
        $('.error-message').hide();
        comments.addClass('active');
        $.get(endpoint, function (data, status) {
            if (status === 'success') {
                if (comments.hasClass('active')) comments.removeClass('active');
            } 
            if (data.items.length) {
                data.items.forEach(function (comment) {
                    if (data.items.length) {
                        comments.append(`
                        <div class="comment">
                            <div class="comment_img">
                                <a target="_blank" href="${comment.snippet.topLevelComment.snippet.authorChannelUrl}">
                                    <img src="${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}"/>
                                </a>
                            </div>
                            <div class="comment_text">
                                <a target="_blank" href="${comment.snippet.topLevelComment.snippet.authorChannelUrl}">
                                    <p class="bold">${comment.snippet.topLevelComment.snippet.authorDisplayName}</p>
                                </a>
                                <p>${comment.snippet.topLevelComment.snippet.textOriginal}</p>
                            </div>
                        </div>`);
                    } 
                });
            } else {
                comments.append(`
                    <div class="error-message"><p>Este video no tiene comentarios.</p></div>
                `);
            }
        });
    } else {
        if (!$('.error-message').length) {
            if (inputVideo.val() === '') {
                comments.append(`
                    <div class="error-message"><p>Ingrese una URL de Youtube.</p></div>
                `);
            } else {
                if (!isValid) {
                    comments.append(`
                        <div class="error-message"><p>Ingresa un URL de Youtube válido.</p></div>
                    `);
                }
            }
            
            if (numberOfComments.val() === '') {
                comments.append(`
                    <div class="error-message"><p>Ingrese un número de comentarios a mostrar.</p></div>
                `);
            }

            
        }
    }
};

var main = function () {
    cache();
    setup();
    bind();
};

document.addEventListener('DOMContentLoaded', main);
