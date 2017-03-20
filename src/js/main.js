$(document).ready(function(){

  //////////////
  // BASIC STUFF
  //////////////

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

  // hamburger
  $('#showSidebar').on('click', function(){
    $(this).toggleClass('is-active');
    $('.mobile-menu').toggleClass('is-active');
    $('.pusher').toggleClass('is-active');
  });

  $(document).bind("mouseup touchend",function (e) {
    var container = new Array();
    container.push($('.mobile-menu'));

    $.each(container, function(key, value) {
        if (!$(value).is(e.target) && $(value).has(e.target).length === 0) {
          $('#showSidebar').removeClass('is-active');
          $('.mobile-menu').removeClass('is-active');
          $('.pusher').removeClass('is-active');
        }
    });
  });
  // Masked input
  $("#date").mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
  $("input[name='phone']").mask("9 (999) 999-9999");

  //////////////
  // FIRST STEP
  //////////////

  // set active class
  $('.exchange-list__item').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
  });

  $('.counter__block__filter').on('click', function(){
    var currentFilter = $(this).data('filter');
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    // filters
    var targetBlocks = $(this).closest('.col-sm-10').find('.exchange-list__item');

    $.each(targetBlocks, function(key, val){
      console.log(val);
      if ( $(val).data('currency') == currentFilter){
        $(this).show();
      } else{
        $(this).hide();
      }
    });

  });

  $('.counter').hide();
  $('.exchange').on('click', '.btn-primary', function(){
    $('.exchange').fadeOut();
    $('.counter').fadeIn();
  });

  // refresh functionality
  $('.ico-refresh').on('click', function(){
    var that = $(this);
    that.addClass('refreshing');

    // some ajax stuff

    setTimeout(function(){
      that.removeClass('refreshing');
    }, 1000);
  });

  //////////////
  // LOGIC
  //////////////


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

  // store selected currecnies
  var selectedIncomingCurrencyID = "";
  var selectedOutgoingCurrencyID = "";

  // UI
  $('.ui-select__visible').on('click', function(){
    $(this).parent().find('.ui-select__dropdown').toggleClass('active');
  });

  $('#incomingDirections').on('click', '.ui-select__dropdown__item', function(){
    $(this).parent().removeClass('active');
    selectedIncomingCurrencyID = $(this).data('id');
    $.each(IncomingDirectionsCurrencies, function(key, val){
      if ( val.CurrencyId == selectedIncomingCurrencyID){
        var buildSelectedHtml = '<i class="ico ico-select"></i><i class="ico ico-currency ico-currency--'+ val.LogoName +'"></i><span class="currency__name">' + val.Title + '</span>'
        $('#selectedIncomingDirection').html(buildSelectedHtml);
      }
    });
  });

  $('#outgoingDirections').on('click', '.ui-select__dropdown__item', function(){
    $(this).parent().removeClass('active');
    selectedOutgoingCurrencyID = $(this).data('id');
    $.each(OutgoingDirectionsCurrencies, function(key, val){
      if ( val.CurrencyId == selectedOutgoingCurrencyID){
        var buildSelectedHtml = '<i class="ico ico-select"></i><i class="ico ico-currency ico-currency--'+ val.LogoName +'"></i><span class="currency__name">' + val.Title + '</span>'
        $('#selectedOutgoingDirection').html(buildSelectedHtml);
      }
    });
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


  // SECOND STEP FUNCTIONALITY
  var paymentData = {};
  var firstStepValid = false;

  function firstStepValidation(){
    if (paymentData.incomingCurrency == ""){
      $('#incomingDirections').closest('.ui-select').addClass('not-valid');
    } else{
      $('#incomingDirections').closest('.ui-select').removeClass('not-valid');
    }

    if (paymentData.incomingValue == ""){
      $('#incomingValue').addClass('not-valid');
    } else{
      $('#incomingValue').removeClass('not-valid');
    }

    if (paymentData.incomingAccount == ""){
      $('#incomingAccount').addClass('not-valid');
    } else{
      $('#incomingAccount').removeClass('not-valid');
    }

    if (paymentData.outgoingCurrency == ""){
      $('#outgoingDirections').closest('.ui-select').addClass('not-valid');
    } else{
      $('#outgoingDirections').closest('.ui-select').removeClass('not-valid');
    }

    if (paymentData.outgoingValue == ""){
      $('#outgoingValue').addClass('not-valid');
    } else{
      $('#outgoingValue').removeClass('not-valid');
    }

    if (paymentData.outgoingAccount == ""){
      $('#outgoingAccount').addClass('not-valid');
    } else{
      $('#outgoingAccount').removeClass('not-valid');
    }

    if (paymentData.incomingCurrency == "" || paymentData.incomingValue == "" || paymentData.incomingAccount == "" || paymentData.outgoingCurrency == "" || paymentData.outgoingValue == "" || paymentData.outgoingAccount == ""){
      firstStepValid = false;
    } else{
      firstStepValid = true;
    }
  }

  $('#personalData').hide();

  $('#firstStep').on('click', function(){
    paymentData = {
      "incomingCurrency" : selectedIncomingCurrencyID,
      "incomingValue" : $('#incomingValue').val(),
      "incomingAccount" : $("#incomingAccount").val(),
      "outgoingCurrency" : selectedOutgoingCurrencyID,
      "outgoingValue" : $('#outgoingValue').val(),
      "outgoingAccount" : $("#outgoingAccount").val()
    }

    // validation
    firstStepValidation();

    // if valid show next step
    if (firstStepValid == true){
      var store = $('#copyPasteBlock').html(); // store block
      $('#copyPasteBlock').html(''); // erase contents

      $('#pasteCopyPasteBlock').html(store); // paste in nearby col
      // show form then
      $('#personalData').fadeIn();

    }
  });


  ///////////
  // PROFILE PAGE
  //////////

  $('#profileRange').rangeslider({
    polyfill: false,
    // Callback function
    onInit: function() {},

    // Callback function
    onSlide: function(position, value) {},

    // Callback function
    onSlideEnd: function(position, value) {}
  });

  if ( $('#highChart').length > 0 ){
    Highcharts.chart('highChart', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            // categories: [
            //     '3',
            //     '6',
            //     '9',
            //     '12',
            //     '15'
            // ],
            title: {
                text: 'Срок вклада'
            }
        },
        yAxis: {
            title: {
                text: 'Сумма'
            },
            gridLineDashStyle: 'ShortDash'
        },
        tooltip: {
            valueSuffix: '',
            headerFormat: "",
            pointFormat: '<b>{point.y}</b><br/>'
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Доход:',
            data: [6000, 6700, 7500, 6000, 8000, 14000, 9000, 7000, 8600, 12000, 9000, 15000, 13500, 10000]
        }
        // , {
        //     name: 'Jane',
        //     data: [1, 3, 4, 3, 3, 5, 4]
        // }
        ]
    });

  }

  // Cooy code to clipboard
  $(".profile__content__clipboard__copy").on('click', function(){
    $(this).parent().find("textarea").select();
    document.execCommand('copy');
    $('.modal').addClass('blink');
    setTimeout(
      function(){
      $('.modal').removeClass('blink');
    }
    , 1500);
  });

  // Profile hamburger
  $('#profileHamb').on('click', function(){
    $(this).toggleClass('is-active');
    $('.profile__sidebar__menu').slideToggle();
  });

  // stacktable
  $('.table').stacktable();

});
