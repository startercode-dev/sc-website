import axios from 'axios';
import $ from 'jquery';
import { showAlert } from '../../../utils/alert';

export const login = async () => {
    const data = {
        email: $('#email').val(),
        password: $('#password').val(),
    };

    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/login',
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', 'logged in successful');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/auth/logout',
        });

        if ((res.data.status = 'success')) {
            console.log('logout');
            // location.reload(true)};
        }
    } catch (err) {
        // console.log(err);
        showAlert('error', 'cant logout for some reason, try again later');
    }
};

export const signup = async () => {
    const data = {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        passwordConfirm: $('#password-confirm').val(),
    };

    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/signup',
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', 'signup successful!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }
};

export const forgotPassword = async () => {
    const data = {
        email: $('#email').val(),
    };

    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/auth/forgotPassword',
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', 'email has been sent');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }
};

export const resetPassword = async () => {
    const data = {
        password: $('#password').val(),
        passwordConfirm: $('#password-confirm').val(),
    };
    const token = window.location.pathname.split('/')[2];

    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/auth/resetPassword/${token}`,
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', 'password reset successful, please login');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.msg);
    }
};
