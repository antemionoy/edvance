/**
 * 
 * @param {type} form - html selector
 * @param {type} validate - json list obj: pattern
 * @param {type} error_calback - function
 * @param {type} success_calback - function
 * @returns {undefined}
 */
function LongByteValidate(form, validate, error_calback, success_calback)
{
    form = $(form).first();
    var error = false;
    for (selector in validate) {
        $(selector, form).removeClass("error");
        if ($(selector, form).attr("type") == "checkbox") {
            $("label[for="+$(selector, form).attr("id")+"]", form).removeClass("error");
            if ($(selector, form).is(":checked") != validate[selector]) {
                error = true;
                $(selector, form).addClass("error");
                $("label[for="+$(selector, form).attr("id")+"]", form).addClass("error");
            }
        }
        else if (!validate[selector].test($(selector, form).val())) {
            error = true;
            $(selector, form).addClass("error");
        }
    }
    if (error) {
        if (typeof(error_calback) == "function")
            error_calback();
        return false;
    } else {
        if (typeof(success_calback) == "function")
            success_calback();
        return true;
    }
}