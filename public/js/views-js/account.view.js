import axios from 'axios';
import $ from 'jquery';
import { showAlert } from '../../../utils/alert';

export const updateMyPassword = async () => {
    $('.btn-auth-save__password').text('updating...');
    try {
        const data = {
            passwordCurrent: $('#password-current').val(),
            password: $('#password').val(),
            passwordConfirm: $('#password-confirm').val(),
        };
        const url = '/api/v1/account/updateMyPassword';
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type} updated`);
            window.setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }

    $('#password-current').val('');
    $('#password').val('');
    $('#password-confirm').val('');
    $('.btn-auth-save__password').text('save password');
};

export const updateMySettings = async () => {
    try {
        const data = {
            name: $('#name').val(),
            email: $('#email').val(),
        };
        const url = '/api/v1/account/updateMe';

        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type} updated`);
            window.setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }
};
