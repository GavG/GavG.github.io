var fixed = false;
var next2 = false;
var next3 = false;

$(window).scroll(function() {

  var wScroll = $(this).scrollTop();

  if (wScroll < $(window).height() - 50 && !fixed) {

    $('.foreground2').css({
      'width': $(window).height() - wScroll,
      'height': $(window).height() - wScroll,
      'font-size': ($(window).height() - wScroll) / 2,
      'line-height': $(window).height() - wScroll + 'px'
    });

    $('.foreground1').css({
      'transform': 'translate(' + wScroll / 4 + '%,0px)',
      'width': $(window).height() - wScroll,
      'height': $(window).height() - wScroll,
      'font-size': ($(window).height() - wScroll) / 2,
      'line-height': $(window).height() - wScroll + 'px'
    });

    $('.foreground0').css({
      'transform': 'translate(' + wScroll / 2 + '%,0px)',
      'width': $(window).height() - wScroll,
      'height': $(window).height() - wScroll,
      'font-size': ($(window).height() - wScroll) / 2,
      'line-height': $(window).height() - wScroll + 'px'
    });
  } else {
    fixed = true;
    $('.background').css({
      'position': 'fixed',
      'top': '0',
      'height': '50px'
    })

    $('.foreground2').css({
      'width': '50px',
      'height': '50px',
      'font-size': '30px',
      'line-height': '50px'
    });

    $('.foreground1').css({
      'width': '50px',
      'height': '50px',
      'font-size': '30px',
      'line-height': '50px'
    });

    $('.foreground0').css({
      'width': '50px',
      'height': '50px',
      'font-size': '30px',
      'line-height': '50px'
    });

    if (!next3) {
      $('.arrow').css({
        'transform': 'rotate(135deg)'
      })
      $('.foreground2').html('1');
    }

    if (next3 && wScroll > $(window).height() / 2) {
      $('.arrow').hide();
    }

    if (wScroll <= 0) {
      if (!next2 && !next3) {
        $('.arrow').css({
          'transform': 'rotate(-135deg)'
        })
        $('body').css({
          'background-color': ' #F57F17'
        })
      } else {
        $('.arrow').css({
          'transform': 'rotate(-45deg)'
        })
        next3 = true;
      }

      $('.next2').css({
        'display': 'block'
      })
      $('.next').css({
        'position': 'absolute'
      })
      $('body').css({
        'width': '200vw'
      })

      var lScroll = $(this).scrollLeft();

      if (next3 && lScroll == 0) {
        $('body').css({
          'background-color': '#43A047'
        })
        $('.foreground0').html('3');
      }

      if (lScroll >= $(window).width() && !next3) {
        $('.arrow').css({
          'transform': 'rotate(45deg)'
        })
        next2 = true;
        $('.foreground1').html('2');
        $('.next h1').html('Roll with the scroll');
      }


    }

  }
});
