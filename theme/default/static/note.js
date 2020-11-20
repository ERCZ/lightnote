hljs.initHighlightingOnLoad();
var mask = document.querySelector('.mask');
var displayTip = getDisplayTip();
mask.addEventListener('click', function (e) {
    if (e.target === this) this.style.display = 'none';
});
document.querySelector('#post-comment').addEventListener('click', function (e) {
    mask.style.display = 'block';
    document.getElementsByName('to')[0].value = '';
    var content = document.querySelector('.mask textarea[name=content]');
    content.value = '';
    content.focus();
});
document.querySelector('#note-comments').addEventListener('click', function (e) {
    if (e.target.nodeName !== 'A') return;
    if (!e.target.classList.contains('reply')) return;
    var userid = e.target.dataset.userid;
    document.querySelector('#post-comment').click();
    document.getElementsByName('to')[0].value = userid;
});
document.querySelector('#edit-comment').addEventListener('submit', function (e) {
    e.preventDefault();
    if (document.getElementsByName('content')[0].value === '') {
        displayTip('error', '你没有输入任何内容');
        return false;
    };
    var submit = document.querySelector('#edit-comment input[type=submit]');
    submit.setAttribute('disabled', 'disabled');
    submit.value = '正在提交';
    var data = new FormData(this);
    axios({
        method: 'post', url: '/api/comment/', data, headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(data => {
        data = data.data;
        if (data.code !== 0) {
            displayTip('error', data.message);
        } else {
            displayTip('success', data.message);
            setTimeout(() => {
                location.reload();
            }, 500);
        };
        submit.removeAttribute('disabled');
        submit.value = '提交';
    }).catch(err => {
        displayTip('error', err.message);
        submit.removeAttribute('disabled');
        submit.value = '提交';
    });
    return false;
});