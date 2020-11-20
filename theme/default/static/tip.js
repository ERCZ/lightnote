function getDisplayTip() {
    var id;
    return function (type, message) {
        var tip = document.querySelector('.tip');
        if (tip) {
            document.body.removeChild(tip);
            clearTimeout(id);
        };
        var div = document.createElement('div');
        div.classList.add('tip', type);
        div.textContent = message;
        document.body.appendChild(div);
        id = setTimeout(() => {
            div.style.display = 'none';
        }, 5000);
    }
}
