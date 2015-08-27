$(document).ready(function () {

    PNotify.prototype.options.styling = "bootstrap3";
    PNotify.prototype.options.delay = 5000;
    PNotify.prototype.options.width = "350px";
    function mymessage(mytype, mytitle, mytext) {
        new PNotify({
            type: mytype,
            title: mytitle,
            text: mytext,
            styling: 'bootstrap3'
        });
    }

    $(document).on("click", ".notify-zone", function () {
       console.log("notify-zone");
       var zone = $(this).data('id');
       $.ajax({
              'url' : '/servers/'+$(this).data('server')+'/domains/notify/'+zone,
              'type' : 'GET',
              'cache' : false,
              'dataType' : 'json',
              'success' : function(data) {
                      if(data.result) {
                        mymessage("success", "Notify Zone", data.result +" for "+ zone);
                      }
                      if(data.error) {
                        mymessage("error", "Notify Zone", data.error);
                      }
              }
       });
    });

    $(document).on("click", ".retrieve-zone", function () {
       console.log("retrieve-zone");
       var zone = $(this).data('id');
       $.ajax({
              'url' : '/servers/'+$(this).data('server')+'/domains/retrieve/'+zone,
              'type' : 'GET',
              'cache' : false,
              'dataType' : 'json',
              'success' : function(data) {
                      console.log(data);
                      if(data.result) {
                        mymessage("success", "axfr-retrieve zone", data.result + " for "+ zone);
                      }
                      if(data.error) {
                        mymessage("error", "axfr-retrieve zone", data.error);
                      }
              }
       });
    });

    // Init bootstrap form validatoin plugin
    $('#form-add-domain')
      .formValidation({
         framework: 'bootstrap',
         excluded: [':disabled', ':hidden', ':not(:visible)'],
         icon: {
              valid: 'glyphicon glyphicon-ok',
              invalid: 'glyphicon glyphicon-remove',
              validating: 'glyphicon glyphicon-refresh'
         },
         fields: {
            name: {
                message: 'The domain name is not valid',
                validators: {
                    notEmpty: {
                        message: 'The domain name is required'
                    },
                    regexp: {
                        enabled: true,
                        regexp: /^[a-z0-9_\.-]+$/,
                        message: 'The domain name can only consist of alphabetical, numbers, underscore, dash, dot'
                    }
                }
            },
            master: {
                message: 'The master list is not valid',
                validators: {
                    regexp: {
                        enabled: true,
                        regexp: /^[0-9\.,:]+$/,
                        message: 'The master list must be a list of IPv4 or Ipv6 separate by a comma'
                    },
                }
            },
         }
    })
    .on('error.field.bv', function (e, data) {
        console.log(data.field, data.element, '-->error');
    })
    .on('success.field.bv', function (e, data) {
        //console.log(data.field, data.element, '-->success');
    });

    // Reset all given fields. It hides the error messages and feedback icons.
    $('#add-domain-modal').on('hidden.bs.modal', function() {
      //console.log(".on hidden.bs.modal");
      // Not working as expected
      $('#form-add-domain').formValidation('resetForm', true);
      // So let's do it manually, foreach input group
      $('.form-group').each(function(i, obj) {
         $(this).removeClass('has-error');
         $(this).removeClass('has-error');
         $(this).removeClass('has-success');
      });
      // foreach icon result
      $('.form-control-feedback').each(function(i, obj) {
         $(this).css("display" ,"none");
         $(this).removeClass('glyphicon');
         $(this).removeClass('glyphicon-remove');
         $(this).removeClass('glyphicon-ok');
      });
    });

});
