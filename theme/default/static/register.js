var registerForm = document.querySelector('#register');
var forgetForm = document.querySelector('#forget');
var displayTip = getDisplayTip();
registerForm && registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var username = document.getElementsByName('username')[0].value;
    if (!checkUsername(username)) return;
    var email = document.getElementsByName('email')[0].value;
    if (!checkEmail(email)) return;
    var password = document.getElementsByName('password')[0].value;
    if (!checkPassword(password)) return;
    var confirmpassword = document.getElementsByName('confirmpassword')[0].value;
    if (!checkConfirmPassword(password, confirmpassword)) return;
    var authcode = document.getElementsByName('authcode')[0].value;
    if (!checkAuthcode(authcode)) return;
    var submit = document.querySelector('form input[type=submit]');
    submit.setAttribute('disabled', 'disabled');
    submit.value = '正在注册，请稍后...';
    var formData = new FormData(registerForm);
    axios({
        method: 'post',
        url: '/api/register/',
        data: formData
    }).then(data => {
        submit.removeAttribute('disabled');
        submit.value = '注册';
        data = data.data;
        if (data.code !== 0) {
            displayTip('error', data.message);
        } else {
            displayTip('success', data.message + ',即将跳转到主页');
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                location.replace('/');
            }, 2000);
        };
    }).catch(err => {
        displayTip('error', err.message);
        submit.removeAttribute('disabled');
        submit.value = '注册';
    });
    return false;
});
forgetForm && forgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var email = document.getElementsByName('email')[0].value;
    if (!checkEmail(email)) return;
    var newpassword = document.getElementsByName('newpassword')[0].value;
    if (!checkPassword(newpassword)) return;
    var confirmpassword = document.getElementsByName('confirmpassword')[0].value;
    if (!checkConfirmPassword(newpassword, confirmpassword)) return;
    var authcode = document.getElementsByName('authcode')[0].value;
    if (!checkAuthcode(authcode)) return;
    var submit = document.querySelector('form input[type=submit]');
    submit.setAttribute('disabled', 'disabled');
    submit.value = '正在重置，请稍后...';
    var formData = new FormData(forgetForm);
    axios({
        method: 'post',
        url: '/api/forget/',
        data: formData
    }).then(data => {
        submit.removeAttribute('disabled');
        submit.value = '重置密码';
        data = data.data;
        if (data.code !== 0) {
            displayTip('error', data.message);
        } else {
            displayTip('success', data.message + ',即将跳转到登录页');
            setTimeout(() => {
                location.replace('/login/');
            }, 2000);
        };
    }).catch(err => {
        displayTip('error', err.message);
        submit.removeAttribute('disabled');
        submit.value = '重置密码';
    });
    return false;
});
document.getElementById('getauthcode').addEventListener('click', function (e) {
    var email = document.getElementsByName('email')[0].value;
    if (email === '') {
        displayTip('warning', '请填写邮箱后再点击获取验证码');
        return;
    };
    var regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!regexp.test(email)) {
        displayTip('error', '邮箱格式错误');
        return;
    };
    this.setAttribute('disabled', 'disabled');
    this.value = '正在获取...';
    axios({
        method: 'post',
        url: '/api/authcode/',
        data: { email }
    }).then(data => {
        data = data.data;
        if (data.code !== 0) {
            displayTip('error', data.message);
            this.removeAttribute('disabled');
            this.value = '获取验证码';
        } else {
            displayTip('success', data.message + ' 如果没有收到验证码请检查你的邮箱并于一分钟后重试。');
            var num = 60;
            var clock = setInterval(() => {
                if (num > 0) {
                    this.value = `${num--}s后重新获取`;
                } else {
                    clearInterval(clock);
                    this.removeAttribute('disabled');
                    this.value = '获取验证码';
                };
            }, 1000);
        };
    }).catch(err => {
        displayTip('error', err.message);
        this.removeAttribute('disabled');
        this.value = '获取验证码';
    });
});

function checkUsername(value) {
    var regexp = /^\S+$/;
    if (!regexp.test(value)) {
        displayTip('error', '用户名格式错误，用户名中不得包含空格。');
        return false;
    };
    return true;
}
function checkEmail(value) {
    var regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!regexp.test(value)) {
        displayTip('error', '邮箱格式错误。');
        return false;
    };
    return true;
}
function checkPassword(value) {
    var regexp = /^\S{8,}$/;
    if (!regexp.test(value)) {
        displayTip('error', '密码格式错误，密码中不得包含空格且至少八位。');
        return false;
    };
    return true;
}
function checkConfirmPassword(password, confirmpassword) {
    if (password!==confirmpassword) {
        displayTip('error', '密码前后不一致。');
        return false;
    };
    return true;
}
function checkAuthcode(value) {
    var regexp = /^\d{6}$/;
    if (!regexp.test(value)) {
        displayTip('error', '验证码格式不正确，验证码应为六位数字。');
        return false;
    };
    return true;
}