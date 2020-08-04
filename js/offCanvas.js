(function ($) {
    "use strict"; // Start of use strict

    $(document).ready(function () {
        $(".submit-form").click(onSubmit);
    });

    // .click(sendEmail)
    function onSubmit(ev) {
        var email = $('.email');
        var subject = $('.subject');
        var messageBody = $('.message-body');
        window.open(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${email.val()}&su=${subject.val()}&body=${messageBody.val()}&bcc=minash.8@gmail.com`, '_blank');
        email.val('');
        subject.val('');
        messageBody.val('');
        openCanvas();
    }
})(jQuery); // End of use strict

function openCanvas() {
    document.querySelector('.offcanvas-btn').classList.toggle('offcanvas-btn-open');
    document.querySelector('.offcanvas-aside').classList.toggle('offcanvas-aside-open');
}