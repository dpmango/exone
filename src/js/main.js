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

  // Masked input
  $("#date").mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
  $("input[name='phone']").mask("9 (999) 999-9999");

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
      firstStepValid = false;
    } else{
      $('#incomingDirections').closest('.ui-select').removeClass('not-valid');
    }

    if (paymentData.incomingValue == ""){
      $('#incomingValue').addClass('not-valid');
      firstStepValid = false;
    } else{
      $('#incomingValue').removeClass('not-valid');
    }

    if (paymentData.incomingAccount == ""){
      $('#incomingAccount').addClass('not-valid');
      firstStepValid = false;
    } else{
      $('#incomingAccount').removeClass('not-valid');
    }

    if (paymentData.outgoingCurrency == ""){
      $('#outgoingDirections').closest('.ui-select').addClass('not-valid');
      firstStepValid = false;
    } else{
      $('#outgoingDirections').closest('.ui-select').removeClass('not-valid');
    }

    if (paymentData.outgoingValue == ""){
      $('#outgoingValue').addClass('not-valid');
      firstStepValid = false;
    } else{
      $('#outgoingValue').removeClass('not-valid');
    }

    if (paymentData.outgoingAccount == ""){
      $('#outgoingAccount').addClass('not-valid');
      firstStepValid = false;
    } else{
      $('#outgoingAccount').removeClass('not-valid');
    }
  }

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
      $('.counter').fadeOut();
      $('.exchange').fadeIn();
    }
  });

  //////////////
  // SECOND STEP
  //////////////

  // set active class
  $('.exchange-list__item').on('click', function(){
    $(this).siblings().removeClass('active');
    $(this).addClass('active');
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

});
