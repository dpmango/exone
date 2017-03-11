$(document).ready(function(){

 	// Prevent # errors
	$('[href="#"]').click(function (e) {
		e.preventDefault();
	});

	// smoth scroll
	$('a[href^="#section"]').click(function(){
        var el = $(this).attr('href');
        $('body, html').animate({
            scrollTop: $(el).offset().top}, 1000);
        return false;
	});

  // enable tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // owl
  $('#owlTestmonials').owlCarousel({
    loop: true,
    nav: true,
    dots: false,
    margin: 0,
    items: 1,
    autoplay: true
  });

  // Masked input
  $("#date").mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
  $("input[name='phone']").mask("9 (999) 999-9999");

  // LOGIC
  var params = {}
  $.ajax({
    type: 'GET',
    url: 'json/currencies.json',
    data: { get_param: 'value' },
    dataType: 'json',
    success: function (data) {
      params = data;
      populateParams();
      pupulateSelectors();
    }
  });

  // store directions first
  var IncomingDirectionsCurrencies = [];
  var OutgoingDirectionsCurrencies = [];

  // populate directions
  function populateParams(){
    $.each(params.data.IncomingDirectionsCurrencies, function(index, element) {
        IncomingDirectionsCurrencies.push(element);
    });
    $.each(params.data.OutgoingDirectionsCurrencies, function(index, element) {
        OutgoingDirectionsCurrencies.push(element);
    });
  }

  // populate selectors on step 1
  function pupulateSelectors(){
      $.each(IncomingDirectionsCurrencies, function(key, val){
        var buildHtml = '<div class="ui-select__dropdown__item" data-id="' + val.CurrencyId + '"><i class="ico ico-currency ico-currency--'+ val.LogoName +'"></i><span class="currency__name">' + val.Title + '</span></div>';
        $('#incomingDirections').prepend(buildHtml);
      });

      $.each(OutgoingDirectionsCurrencies, function(key, val){
        var buildHtml = '<div class="ui-select__dropdown__item" data-id="' + val.CurrencyId + '"><i class="ico ico-currency ico-currency--'+ val.LogoName +'"></i><span class="currency__name">' + val.Title + '</span></div>';
        $('#outgoingDirections').prepend(buildHtml);
      });
  }

  var selectedIncomingCurrencyID = "";
  var selectedOutgoingCurrencyID = "";

  // UI
  $('.ui-select__visible').on('click', function(){
    $(this).parent().find('.ui-select__dropdown').toggleClass('active');
  });
  $('.ui-select__dropdown').on('click', '.ui-select__dropdown__item', function(){
    $(this).parent().removeClass('active');
    selectedIncomingCurrencyID = $(this).data('id');
    console.log(selectedIncomingCurrencyID);
  });

  $(document).mouseup(function (e) {
    var container = new Array();
    container.push($('.ui-select'));

    $.each(container, function(key, value) {
        if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
            $(value).find('.ui-select__dropdown').removeClass('active');
        }
    });
  });

  // FAKE LOGIC
  $('.exchange-list__item').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });


  // FAKE FUNCTIONALITY
  $('#firstStep').on('click', function(){
    $('.counter').fadeOut();
    $('.exchange').fadeIn();
  });

  $('.ico-refresh').on('click', function(){
    var that = $(this);
    that.addClass('refreshing');
    setTimeout(function(){
      that.removeClass('refreshing');
    }, 1000);
  });

  // // Magnific Popup
  // $('.popup-with-zoom-anim').magnificPopup({
  //   type: 'inline',
  //   fixedContentPos: false,
  //   fixedBgPos: true,
  //   overflowY: 'auto',
  //   closeBtnInside: true,
  //   preloader: false,
  //   midClick: true,
  //   removalDelay: 300,
  //   mainClass: 'my-mfp-zoom-in'
  // });
  //
  // $('.popup-with-move-anim').magnificPopup({
  //   type: 'inline',
  //   fixedContentPos: false,
  //   fixedBgPos: true,
  //   overflowY: 'auto',
  //   closeBtnInside: true,
  //   preloader: false,
  //   midClick: true,
  //   removalDelay: 300,
  //   mainClass: 'my-mfp-slide-bottom'
  // });
  //
  // $('.popup-gallery').magnificPopup({
	// 	delegate: 'a',
	// 	type: 'image',
	// 	tLoading: 'Loading image #%curr%...',
	// 	mainClass: 'mfp-img-mobile',
	// 	gallery: {
	// 		enabled: true,
	// 		navigateByImgClick: true,
	// 		preload: [0,1]
	// 	},
	// 	image: {
	// 		tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
	// 	}
	// });
});
