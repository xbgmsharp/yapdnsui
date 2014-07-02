$(document).ready(function () {

    // Init bootstrap select plugin
    $('.selectpicker').selectpicker();

    // Init bootstrap checkbox plugin
    $('input[type="checkbox"]').checkbox({
        buttonStyle: 'btn-danger',
        buttonStyleChecked: 'btn-success',
        checkedClass: 'glyphicon glyphicon-check',
        uncheckedClass: 'glyphicon glyphicon-unchecked'
    });

    // Init bootstrap validator plugin
    $('#form-add-record')
        .bootstrapValidator({
        fields: {
            content: {
                message: 'The content is not valid',
                validators: {
                    notEmpty: {
                        message: 'The content is required'
                    },
                    regexp: {
                        enabled: true,
                        regexp: /^[a-zA-Z0-9_\.-]+$/,
                        message: 'The content can only consist of alphabetical numbers and _ - .'
                    },
                    // Here are the validators need to be enabled/disabled dynamically
                    digits: {
                        enabled: false,
                        message: 'The record can contain only digits'
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
                    notEmpty: {
                        message: 'The priority is required'
                    },
                    integer: {
                        message: 'The priority can contain only digits'
                    },
                    greaterThan: {
                        message: 'The priority must be a positive  number',
                        value: 0
                    }
                }
            },
            ttl: {
                message: 'The ttl is not valid',
                validators: {
                    notEmpty: {
                        message: 'The ttl is required'
                    },
                    integer: {
                        message: 'The ttl can contain only digits'
                    },
                    greaterThan: {
                        message: 'The ttl must be a positive  number',
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
    $('#mod-edit-recordtype').change(function () {
        var type = $(this).val();
        switch (type) {
            case 'A':
                console.log('A');
                $('#form-add-record')
                // Disable all other validators
                .bootstrapValidator('enableFieldValidators', 'content', false, 'regexp')
                .bootstrapValidator('enableFieldValidators', 'content', false, 'digits')
                // Enable ip validator
                .bootstrapValidator('enableFieldValidators', 'content', true, 'ip')
                // Enable ipv4 for the ip validator
                .bootstrapValidator('updateOption', 'content', 'ip', 'ipv6', false)
                // Disable ipv6 for the ip validator
                .bootstrapValidator('updateOption', 'content', 'ip', 'ipv4', true)
                // Update the message for ip validator
                .bootstrapValidator('updateMessage', 'content', 'ip', 'Please enter a valid IPv4 address');
                break;
            case 'AAAA':
                console.log('AAAA');
                $('#form-add-record')
                // Disable all other validators
                .bootstrapValidator('enableFieldValidators', 'content', false, 'regexp')
                .bootstrapValidator('enableFieldValidators', 'content', false, 'digits')
                // Enable ip validator
                .bootstrapValidator('enableFieldValidators', 'content', true, 'ip')
                // Enable ipv6 for the ip validator
                .bootstrapValidator('updateOption', 'content', 'ip', 'ipv6', true)
                // Disable ipv4 for the ip validator
                .bootstrapValidator('updateOption', 'content', 'ip', 'ipv4', false)
                // Update the message for ip validator
                .bootstrapValidator('updateMessage', 'content', 'ip', 'Please enter a valid IPv6 address');
                break;
            case 'SRV':
                console.log('SRV');
                $('#form-add-record')
                // Disable all other validators
                .bootstrapValidator('enableFieldValidators', 'content', false, 'ip')
                .bootstrapValidator('enableFieldValidators', 'content', false, 'digits')
                // Enable regexp validator
                .bootstrapValidator('enableFieldValidators', 'content', true, 'regexp')
                // Update the regexp for the regexp validator
                .bootstrapValidator('updateOption', 'content', 'regexp', 'regexp', /^[a-zA-Z0-9 _\.-]+$/)
                // Update the message for regexp validator
                .bootstrapValidator('updateMessage', 'content', 'regexp', 'Please enter a valid SRV record');
                break;
                // other cases
            default:
                $('#form-add-record')
                // Disable all other validators
                .bootstrapValidator('enableFieldValidators', 'content', false, 'digits')
                .bootstrapValidator('enableFieldValidators', 'content', false, 'ip')
                // Enable regexp validator
                .bootstrapValidator('enableFieldValidators', 'content', true, 'regexp');
                break;
        }
    });
});
