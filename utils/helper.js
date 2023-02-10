import $ from 'jquery';

// Event Routes for index.js
export const eventRoute = (selector, action, fn, condition) => {
    // Checks if selector exist and creates route from event trigger to function execution
    const exist = $(selector).length > 0;
    const conditionValidation = condition !== undefined ? condition : true;
    if (exist && conditionValidation) {
        $(selector).on(action, (e) => {
            e.preventDefault();

            return fn(e);
        });
    }
};

// Pop up message box
export const popupBox = (msg) => {
    $('.popup-box .popup-message').text(msg);
    $('.popup-box').removeClass('hide');

    setTimeout(() => {
        $('.popup-box').addClass('hide');
    }, 3000);
};

// Get random number
export const getRandomInt = (max) => {
    return Math.floor(Math.random() * max + 1);
};
