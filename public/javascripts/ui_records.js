$(document).ready(function () {

    // Init bootstrap select plugin
    $('.selectpicker').selectpicker();

    // Init bootstrap checkbox plugin
    $('#mod-edit-record-disabled').checkboxpicker();

    // Init bootstrap form validation plugin
    $('#form-add-record')
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
                message: 'The record name is not valid',
                validators: {
                    regexp: {
                        enabled: true,
                        regexp: /^[a-zA-Z0-9 _\.-]+$/,
                        message: 'A record name can only consist of alphabetical, numbers, underscore, dash, dot or space'
                    },
                }
            },
            content: {
                message: 'The content is not valid',
                validators: {
                    notEmpty: {
                        message: 'The record content is required'
                    },
                    regexp: {
                        enabled: true,
                        regexp: /^[a-zA-Z0-9 _\.-]+$/,
                        message: 'A record content can only consist of alphabetical, numbers, underscore, dash, dot or space'
                    },
                    // Here are the validators need to be enabled/disabled dynamically
                    digits: {
                        enabled: false,
                        message: 'The record  can contain only digits'
                    },
                    ip: {
                        enabled: false,
                        message: 'Please enter a valid IP address',
                        ipv4: true,
                        ipv6: true
                    }
                }
            },
            priority: {
                message: 'The priority is not valid',
                validators: {
                    integer: {
                        message: 'The priority can contain only digits'
                    },
                    greaterThan: {
                        message: 'The priority must be a positive number',
                        value: 0
                    }
                }
            },
            ttl: {
                message: 'The ttl is not valid',
                validators: {
                    notEmpty: {
                        message: 'The TTL is required'
                    },
                    integer: {
                        message: 'The TTL can contain only digits'
                    },
                    greaterThan: {
                        message: 'The TTL must be a positive number',
                        value: 0
                    }
                }
            }
        }
    })
    .on('error.field.bv', function (e, data) {
        console.log(data.field, data.element, '-->error');
    })
    .on('success.field.bv', function (e, data) {
        //console.log(data.field, data.element, '-->success');
    });

    // On update select
    $('#mod-edit-record-type').change(function () {
        var type = $(this).val();
        switch (type) {
            case 'A':
                console.log('A');
                $('#form-add-record')
                // Disable all other validators
                .formValidation('enableFieldValidators', 'content', false, 'regexp')
                .formValidation('enableFieldValidators', 'content', false, 'digits')
                // Enable ip validator
                .formValidation('enableFieldValidators', 'content', true, 'ip')
                // Enable ipv4 for the ip validator
                .formValidation('updateOption', 'content', 'ip', 'ipv6', false)
                // Disable ipv6 for the ip validator
                .formValidation('updateOption', 'content', 'ip', 'ipv4', true)
                // Update the message for ip validator
                .formValidation('updateMessage', 'content', 'ip', 'Please enter a valid IPv4 address');
                $('#mod-edit-record-content').focus();
                break;
            case 'AAAA':
                console.log('AAAA');
                $('#form-add-record')
                // Disable all other validators
                .formValidation('enableFieldValidators', 'content', false, 'regexp')
                .formValidation('enableFieldValidators', 'content', false, 'digits')
                // Enable ip validator
                .formValidation('enableFieldValidators', 'content', true, 'ip')
                // Enable ipv6 for the ip validator
                .formValidation('updateOption', 'content', 'ip', 'ipv6', true)
                // Disable ipv4 for the ip validator
                .formValidation('updateOption', 'content', 'ip', 'ipv4', false)
                // Update the message for ip validator
                .formValidation('updateMessage', 'content', 'ip', 'Please enter a valid IPv6 address');
                $('#mod-edit-record-content').focus();
                break;
            case 'SRV':
                console.log('SRV');
                $('#form-add-record')
                // Disable all other validators
                .formValidation('enableFieldValidators', 'content', false, 'ip')
                .formValidation('enableFieldValidators', 'content', false, 'digits')
                // Enable regexp validator
                .formValidation('enableFieldValidators', 'content', true, 'regexp')
                // Update the regexp for the regexp validator
                .formValidation('updateOption', 'content', 'regexp', 'regexp', /^[a-zA-Z0-9 _\.-]+$/)
                // Update the message for regexp validator
                .formValidation('updateMessage', 'content', 'regexp', 'Please enter a valid SRV record');
                $('#mod-edit-record-content').focus();
                break;
            // other cases
            default:
                $('#form-add-record')
                // Disable all other validators
                .formValidation('enableFieldValidators', 'content', false, 'digits')
                .formValidation('enableFieldValidators', 'content', false, 'ip')
                // Enable regexp validator
                .formValidation('enableFieldValidators', 'content', true, 'regexp');
                $('#mod-edit-record-content').focus();
                break;
        }
    });

    // Reset all given fields. It hides the error messages and feedback icons.
    $('#add-record-modal').on('hidden.bs.modal', function() {
      // Not working as expected
      $('#form-add-record').formValidation('resetForm', true);
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
