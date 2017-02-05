var gallery = [];
var jsImgFolder = "../img/";
var indexImgFolder = "img/";
var curPosition = 0;

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
      var imgPerPage = 12;
      var pages = Math.ceil(gallery.length/imgPerPage);
      $("#Gallery .page-container").width(100*pages + "%");
      for (picture of gallery) {
        if(i%imgPerPage == 0){
          $("#Gallery .page-container").append("<div class='page' style='width : " + 100/pages + "%'><div class='container-fluid'></div></div>");
        }
        if(i%4 == 0){
          $("#Gallery .page:last .container-fluid").append("<div class='row'> </div>");
        }
        $("#Gallery .page:last .row:last").append('<div class="col-sm-6 col-md-3 col-md-3"><div class="hovereffect"><img src="' + jsImgFolder + picture + '" class="img-responsive img-thumbnail" style="width:100%" alt="Image"><div class="overlay"><h2>' + picture + '</h2><p><a href="javascript:void(0)" onclick="viewImage(\'' + picture + '\')">View</a></p><p><a href="' + indexImgFolder + picture + '" download>Download</a></p></div></div>');

        if(i === 0){
          $(".carousel-indicators").append('<li data-target="#MainPresentation" data-slide-to="' + i + '" class="active"></li>');
          $(".carousel-inner").append('<div class="item active"><img src="' + indexImgFolder + picture + '" alt="Image"></div>');
        } else {
          $(".carousel-indicators").append('<li data-target="#MainPresentation" data-slide-to="' + i + '"></li>');
          $(".carousel-inner").append('<div class="item"><img src="' + indexImgFolder + picture + '" alt="Image"></div>');
        }
        i++;
      }
      $("#Gallery .next").on('click', function(event) {
        event.preventDefault();
        if(curPosition > -100+100/pages){
          var nextPosition = curPosition - 100/pages;
          $("#Gallery .page-container").css("transform", "translateX(" + nextPosition + "%)");
          curPosition = nextPosition;
        }
      });
      $("#Gallery .previous").on('click', function(event) {
        event.preventDefault();
        if(curPosition < 0){
          var nextPosition = curPosition + 100/pages;
          $("#Gallery .page-container").css("transform", "translateX(" + nextPosition + "%)");
          curPosition = nextPosition;
        }
      });
    }
  });
});


function viewImage(image){
  $("#viewImage .modal-title").html(image);
  $("#viewImage .modal-body").html('<img src="' + indexImgFolder + image + '" class="img-responsive img-thumbnail" style="width:100%" alt="Image">');
  $("#viewImage a").attr('href', indexImgFolder + image);
  $("#viewImage").modal('show');
}
