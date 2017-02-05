var gallery = [];
var jsImgFolder = "../img/";
var indexImgFolder = "img/";

$(document).ready(function() {
  $.ajax({
    url: jsImgFolder,
    success: function(data){
      $(data).find("a").attr("href", function (i, val) {
        if (val.match(/\.(jpe?g|png)$/)) {
          gallery.push(val);
        }
      });
    },
    complete: function(){
      var i = 0;
      for (picture of gallery) {
        if(i%4 == 0){
          $("#Gallery nav").before("<div class='row'> </div>");
        }
        $("#Gallery .row:last").append('<div class="col-sm-6 col-md-3 col-md-3"><div class="hovereffect"><img src="' + jsImgFolder + picture + '" class="img-responsive img-thumbnail" style="width:100%" alt="Image"><div class="overlay"><h2>' + picture + '</h2><p><a href="javascript:void(0)" onclick="viewImage(\'' + picture + '\')">View</a></p><p><a href="' + indexImgFolder + picture + '" download>Download</a></p></div></div>');

        if(i === 0){
          $(".carousel-indicators").append('<li data-target="#MainPresentation" data-slide-to="' + i + '" class="active"></li>');
          $(".carousel-inner").append('<div class="item active"><img src="' + indexImgFolder + picture + '" alt="Image"></div>');
        } else {
          $(".carousel-indicators").append('<li data-target="#MainPresentation" data-slide-to="' + i + '"></li>');
          $(".carousel-inner").append('<div class="item"><img src="' + indexImgFolder + picture + '" alt="Image"></div>');
        }
        i++;
      }
    }
  });
});


function viewImage(image){
  $("#viewImage .modal-title").html(image);
  $("#viewImage .modal-body").html('<img src="' + indexImgFolder + image + '" class="img-responsive img-thumbnail" style="width:100%" alt="Image">');
  $("#viewImage a").attr('href', indexImgFolder + image);
  $("#viewImage").modal('show');
}
