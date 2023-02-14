import $ from 'jquery';
import { eventRoute } from '../../utils/helper';
import * as auth from './views-js/auth.view';
import * as account from './views-js/account.view';
import * as home from './views-js/home.view';

// APPLICATION START
$(function () {
    $('window').scrollTop(0);

    // FORM
    eventRoute('.submit-btn', 'click', home.formSubmit);

    //AUTH
    eventRoute('.btn-auth-signup', 'click', auth.signup);
    eventRoute('.btn-auth-login', 'click', auth.login);
    eventRoute('.logout', 'click', auth.logout);
    eventRoute('.btn-auth-forgot_password', 'click', auth.forgotPassword);
    eventRoute('.btn-auth-reset_password', 'click', auth.resetPassword);
    eventRoute('.btn-auth-save__setting', 'click', account.updateMySettings);
    eventRoute('.btn-auth-save__password', 'click', account.updateMyPassword);
});
