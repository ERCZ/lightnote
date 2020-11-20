var loginForm = document.querySelector('#login');
var displayTip = getDisplayTip();
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var email = document.getElementsByName('email')[0].value;
    var regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!regexp.test(email)) {
        displayTip('error', '邮箱格式不正确');
        return;
    };
    var password = document.getElementsByName('password')[0].value;
    regexp = /^\S{8,}$/;
    if (!regexp.test(password)) {
        displayTip('error', '密码格式不正确,密码中不得包含空格且至少八位');
        return;
    };
    var submit = document.querySelector('form input[type=submit]');
    submit.setAttribute('disabled', 'disabled');
    submit.value = '正在登录，请稍后...';
    var formData = new FormData(loginForm);
    axios({
        method: 'post',
        url: '/api/login/',
        data: formData
    }).then(data => {
        submit.removeAttribute('disabled');
        submit.value = '登录';
        data = data.data;
        if (data.code !== 0) {
            displayTip('error', data.message);
        } else {
            displayTip('success', data.message+',即将跳转到主页');
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                location.replace('/');
            }, 2000);
        };
    }).catch(err => {
        displayTip('error', err.message);
        submit.removeAttribute('disabled');
        submit.value = '登录';
    });
    return false;
});