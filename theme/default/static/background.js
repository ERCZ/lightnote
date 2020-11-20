var displayTip = getDisplayTip();
// 菜单项切换
(function () {
    var buttons = document.querySelectorAll('#background-aside li a');
    buttons.forEach(button => {
        button.addEventListener('click', menuClickHandler);
    });
    // 菜单切换处理函数
    function menuClickHandler(e) {
        e.preventDefault();
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        this.classList.add('active');
        location.replace(this.href);
        var type = this.dataset.type;
        var tbody = document.querySelector(`#${type}-manage tbody`);
        if (tbody.innerHTML.trim() === '') {
            document.querySelector(`#${type}-manage .more`).click();
        };
    }
})();

// 加载更多、排序方式切换、正逆序切换
(function () {
    var offset = {
        note: 0,
        user: 0,
        archive: 0,
        tag: 0,
        comment: 0
    };
    var orderBy = {
        note: 'updatedAt',
        user: 'userid',
        archive: 'archiveid',
        tag: 'tagid',
        comment: 'createdAt'
    };
    var desc = {
        note: true,
        user: false,
        archive: false,
        tag: false,
        comment: true
    };
    var limit = 10;
    // 加载更多
    document.querySelectorAll('.more').forEach(more => {
        more.addEventListener('click', moreClickHandler);
    });
    // 排序方式切换
    document.querySelectorAll('.background-main-item p select').forEach(select => {
        select.addEventListener('change', orderByAndDescChangeHandler);
    });
    // 正逆序切换
    document.querySelectorAll('.background-main-item p input[name=desc]').forEach(input => {
        input.addEventListener('change', orderByAndDescChangeHandler);
    });
    // 加载更多处理函数
    function moreClickHandler(e) {
        if (this.hasAttribute('nomore')) return;
        var type = this.dataset.type;
        var tbody = document.querySelector(`#${type}-manage tbody`);
        this.textContent = '正在加载，请稍后...';
        axios({
            method: 'get',
            url: `/api/${type}/`,
            responseType: 'json',
            headers: {
                Authorization: localStorage.getItem('token')
            },
            params: {
                offset: offset[type],
                orderby: orderBy[type],
                desc: desc[type],
                limit
            }
        }).then((data) => {
            var data = data.data;
            if (data.code && data.code !== 0) {
                displayTip('error', data.message);
                this.setAttribute('nomore', 'nomore');
                this.textContent = data.message;
                return;
            }
            var html = generateDataRows(type, data);
            tbody.innerHTML += html;
            if (data.length < limit) {
                this.setAttribute('nomore', 'nomore');
                this.textContent = '没有更多内容了';
            } else {
                this.textContent = '加载更多';
                offset[type] += limit;
            }
        }).catch((err) => {
            this.textContent = err.message += ' 点击重试';
        });
    }
    // 排序方式及正逆序切换处理函数
    function orderByAndDescChangeHandler(e) {
        var type = this.dataset.type;
        if (e.target.nodeName === 'SELECT') {
            orderBy[type] = this.value;
        } else if (e.target.nodeName === 'INPUT') {
            desc[type] = !desc[type];
        } else {
            return;
        };
        offset[type] = 0;
        document.querySelector(`#${type}-manage tbody`).innerHTML = '';
        var more = document.querySelector(`#${type}-manage .more`);
        more.removeAttribute('nomore');
        more.click();
    }
})();

document.querySelector('#note-manage .more').click();

// 表格行生成
function generateDataRows(type, data) {
    var rows = '';
    switch (type) {
        case 'note':
            for (item of data) {
                rows += `<tr><td>${item.noteid}</td><td>${item.title}</td><td>${item.updatedAt}</td><td>${item.public}</td><td>${item.viewCount}</td><td><a data-method="get" href="/api/note/${item.noteid}">详情</a><a data-method="put" href="/api/note/${item.noteid}">修改</a><a data-method="delete" href="/api/note/${item.noteid}">删除</a></td></tr>`;
            };
            break;
        case 'tag':
            for (item of data) {
                rows += `<tr><td>${item.tagid}</td><td>${item.name}</td><td><a data-method="get" href="/api/tag/${item.tagid}">详情</a><a data-method="put" href="/api/tag/${item.tagid}">修改</a><a data-method="delete" href="/api/tag/${item.tagid}">删除</a></td></tr>`;
            };
            break;
        case 'user':
            for (item of data) {
                rows += `<tr><td>${item.userid}</td><td>${item.username}</td><td>${item.email}</td><td>${item.level}</td><td><a data-method="get" href="/api/user/${item.userid}">详情</a><a data-method="put" href="/api/user/${item.userid}">修改</a><a data-method="delete" href="/api/user/${item.userid}">删除</a></td></tr>`;
            };
            break;
        case 'archive':
            for (item of data) {
                rows += `<tr><td>${item.archiveid}</td><td>${item.name}</td><td><a data-method="get" href="/api/archive/${item.archiveid}">详情</a><a data-method="put" href="/api/archive/${item.archiveid}">修改</a><a data-method="delete" href="/api/archive/${item.archiveid}">删除</a></td></tr>`;
            };
            break;
        case 'comment':
            for (item of data) {
                rows += `<tr><td>${item.commentid}</td><td>${item.from.username || null}</td><td>${item.to.username || null}</td><td>${item.note.title}</td><td>${item.content}</td><td>${item.createdAt}</td><td><a data-method="get" href="/api/comment/${item.commentid}">详情</a><a data-method="put" href="/api/comment/${item.commentid}">修改</a><a data-method="delete" href="/api/comment/${item.commentid}">删除</a></td></tr>`;
            };
            break;
        default:
            break;
    }

    return rows;
}

document.querySelector('.mask').addEventListener('click', function (e) {
    if (e.target === this) {
        this.innerHTML = "";
        this.style.display = 'none';
    };
});

// 增删改查
document.querySelectorAll('.background-main-item .add').forEach(item => {
    item.addEventListener('click', addClickHandler);
})
document.querySelectorAll('.background-main-item table').forEach(item => {
    item.addEventListener('click', tableClickHandler);
});

function tableClickHandler(e) {
    e.preventDefault();
    var element = e.target;
    if (element.nodeName !== 'A') return;
    var type = this.dataset.type;
    var url = element.href;
    var method = element.dataset.method;
    var mask = document.querySelector('.mask');
    mask.style.display = 'block';
    generateMaskContent(type, method, url);
    return false;
}
function generateMaskContent(type, method, url) {
    var content = '';
    var mask = document.querySelector('.mask');
    switch (method) {
        case 'delete':
            content += `<div id="confirm-delete"><p>你确定要删除该${type}？</p><button id="ok" data-url="${url}">确认</button><button id="cancel">取消</button></div>`;
            mask.innerHTML = content;
            document.querySelector('#confirm-delete #ok').addEventListener('click', deleteHandler);
            document.querySelector('#confirm-delete #cancel').addEventListener('click', function () { mask.click() });
            break;
        case 'get':
            axios({
                method: 'get',
                url,
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }).then(data => {
                data = data.data;
                switch (type) {
                    case 'note':
                        content += '<div>';
                        content += `<p>ID：${data.noteid}</p>`;
                        content += `<p>标题：${data.title}</p>`;
                        content += `<p>友好名：${data.friendlyName}</p>`;
                        content += `<p>是否公开：${data.public}</p>`;
                        content += `<p>浏览量：${data.viewCount}</p>`;
                        var temp = '';
                        for (const tag of data.tags) {
                            temp += `${tag.name}&ensp;`;
                        };
                        content += `<p>标签：${temp}</p>`;
                        temp = '';
                        for (const archive of data.archives) {
                            temp += `${archive.name}&ensp;`;
                        };
                        content += `<p>归档：${temp}</p>`;
                        content += `<p>评论：${data.comments.length}条</p>`;
                        content += `<p>创建于：${data.createdAt}</p>`;
                        content += `<p>更新于：${data.updatedAt}</p>`;
                        content += `<p>描述：${data.desc}</p>`;
                        content += '</div>';
                        mask.innerHTML = content;
                        break;
                    case 'user':
                        content += '<div>';
                        content += `<p>ID：${data.userid}</p>`;
                        content += `<p>用户名：${data.username}</p>`;
                        content += `<p>邮箱：${data.email}</p>`;
                        content += `<p>密码：${data.password}</p>`;
                        content += `<p>账号级别：${data.level}</p>`;
                        content += '</div>';
                        mask.innerHTML = content;
                        break;
                    case 'archive':
                        content += '<div>';
                        content += `<p>ID：${data.archiveid}</p>`;
                        content += `<p>名称：${data.name}</p>`;
                        content += `<p>描述：${data.desc}</p>`;
                        content += `<p>包含文章数：${data.notes.length}</p>`;
                        content += '</div>';
                        mask.innerHTML = content;
                        break;
                    case 'tag':
                        content += '<div>';
                        content += `<p>ID：${data.tagid}</p>`;
                        content += `<p>名称：${data.name}</p>`;
                        content += `<p>包含文章数：${data.notes.length}</p>`;
                        content += '</div>';
                        mask.innerHTML = content;
                        break;
                    case 'comment':
                        content += '<div>';
                        content += `<p>ID：${data.commentid}</p>`;
                        content += `<p>发布者：${data.from.username || null}</p>`;
                        content += `<p>发送给：${data.to.username || null}</p>`;
                        content += `<p>所在文章：${data.note.title}</p>`;
                        content += `<p>内容：${data.content}</p>`;
                        content += `<p>发布时间：${data.createdAt}</p>`;
                        content += '</div>';
                        mask.innerHTML = content;
                        break;
                };
            }).catch(err => {
                displayTip('error', err.message);
                mask.click();
                return;
            });
            break;
        case 'put':
            if (type === 'note') {
                generatePutNoteTemplate(url).then(data => {
                    mask.innerHTML = data;
                    document.querySelector('.mask form').addEventListener('submit', putHandler);
                });
            } else {
                axios({
                    url,
                    method: 'get',
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                }).then(data => {
                    data = data.data;
                    content += `<form action="${url}">`;
                    switch (type) {
                        case 'user':
                            content += `<fieldset><label style="display:none">ID：<input type="text" name="userid" value="${data.userid}"></label></fieldset>`;
                            content += `<fieldset><label>用户名：<input type="text" name="username" value="${data.username}"></label></fieldset>`;
                            content += `<fieldset><label>邮箱：<input type="email" name="email" value="${data.email}"></label></fieldset>`;
                            content += `<fieldset><label>密码：<input type="text" name="password" value="${data.password}"></label></fieldset>`;
                            content += `<fieldset><label>账户类型：<select name="level">`;
                            content += `<option value="1" ${data.level === 1 ? 'selected' : ''}>普通用户</option>`;
                            content += `<option value="0" ${data.level === 0 ? 'selected' : ''}>管理员用户</option>`;
                            content += `</select></label></fieldset>`;
                            break;
                        case 'archive':
                            content += `<fieldset><label style="display:none">ID：<input type="text" name="archiveid" value="${data.archiveid}"></label></fieldset>`;
                            content += `<fieldset><label>名称：<input type="text" name="name" value="${data.name}"></label></fieldset>`;
                            content += `<fieldset><label>描述：<textarea name="desc">${data.desc}</textarea></label></fieldset>`;
                            break;
                        case 'tag':
                            content += `<fieldset><label style="display:none">ID：<input type="text" name="tagid" value="${data.tagid}"></label></fieldset>`;
                            content += `<fieldset><label>名称：<input type="text" name="name" value="${data.name}"></label></fieldset>`;
                            break;
                        case 'comment':
                            content += `<fieldset><label style="display:none">ID：<input type="text" name="commentid" value="${data.commentid}"></label></fieldset>`;
                            content += `<fieldset><label>描述：<textarea name="content">${data.content}</textarea></label></fieldset>`;
                            break;
                        default:
                            break;
                    };
                    content += `<input type="submit" value="提交">`;
                    content += `</form>`;
                    mask.innerHTML = content;
                    document.querySelector('.mask form').addEventListener('submit', putHandler);
                }).catch(err => {
                    displayTip('error', err.message);
                    mask.click();
                    return;
                });
            };
            break;
        default:
            break;
    };
}
async function generatePutNoteTemplate(url) {
    var mask = document.querySelector('.mask');
    try {
        var notedata = await axios({
            method: 'get', url, headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        var archivedata = await axios({
            url: '/api/archive/', method: 'get', headers: {
                Authorization: localStorage.getItem('token')
            }
        });
        var tagdata = await axios({
            url: '/api/tag/', method: 'get', headers: {
                Authorization: localStorage.getItem('token')
            }
        });
    } catch (err) {
        displayTip('error', err.message);
        mask.click();
        return;
    };
    var content = '';
    content += `<form action="${url} enctype="multipart/form-data"">`;
    content += `<fieldset><label style="display:none">ID：<input type="text" name="noteid" value="${notedata.data.noteid}"></label></fieldset>`;
    content += `<fieldset><label>标题：<input type="text" name="title" value="${notedata.data.title}"></label></fieldset>`;
    content += `<fieldset><label>友好名：<input type="text" name="friendlyName" value="${notedata.data.friendlyName || ''}"></label></fieldset>`;
    content += `<fieldset><label>文章描述：<textarea name="desc">${notedata.data.desc}</textarea></label></fieldset>`;
    content += `<fieldset><label>是否公开：<select name="public">`;
    content += `<option value="1" ${notedata.data.public === 1 ? 'selected' : ''}>是</option>`;
    content += `<option value="0" ${notedata.data.public === 0 ? 'selected' : ''}>否</option>`;
    content += `</select></label></fieldset>`;
    content += '<fieldset><p>归档：</p>';
    for (const archive of archivedata.data) {
        var checked = false;
        for (const archive2 of notedata.data.archives) {
            if (archive.archiveid === archive2.archiveid) {
                checked = true;
                break;
            }
        }
        content += `<label>${archive.name}<input type="checkbox" value="${archive.archiveid}" name="archive" ${checked ? 'checked' : ''}></label>&ensp;`;
    };
    content += `</fieldset>`;
    content += '<fieldset><p>标签：</p>';
    for (const tag of tagdata.data) {
        var checked = false;
        for (const tag2 of notedata.data.tags) {
            if (tag.tagid === tag2.tagid) {
                checked = true;
                break;
            }
        }
        content += `<label>${tag.name}<input type="checkbox" value="${tag.tagid}" name="tag" ${checked ? 'checked' : ''}></label>&ensp;`;
    };
    content += `</fieldset><fieldset><label>Markdown文件：<input type="file" name="markdown"></label></fieldset>`;
    content += `<input type="submit" value="提交">`;
    content += `</form>`;
    return content;
}
function deleteHandler(e) {
    var url = this.dataset.url;
    displayTip('success', '删除成功');
    axios({
        method: 'delete',
        url,
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(data => {
        data = data.data;
        if (data.code === 0) {
            displayTip('success', '删除成功');
            document.querySelector('.mask').click();
        } else {
            displayTip('error', '删除失败');
        };
    }).catch(err => {
        displayTip('error', err.message);
    });
}
function putHandler(e) {
    e.preventDefault();
    var button = this.querySelector('input[type=submit]');
    button.setAttribute('disabled', 'disabled');
    button.value = '正在上传';
    var mask = document.querySelector('.mask');
    var data = new FormData(this);
    axios({
        method: 'put',
        url: this.getAttribute('action'),
        data,
        headers: {
            Authorization: localStorage.getItem('token')
        }
    }).then(data => {
        data = data.data;
        if (data.code === 0) {
            displayTip('success', data.message);
            mask.click();
            return false;
        } else {
            displayTip('error', data.message);
        };
    }).catch(err => {
        displayTip('error', err.message);
    });
    button.removeAttribute('disabled');
    button.textContent = '提交';
    return false;
}
async function addClickHandler(e) {
    e.preventDefault();
    var mask = document.querySelector('.mask');
    mask.style.display = 'block';
    var type = this.dataset.type;
    var content = '';
    switch (type) {
        case 'note':
            try {
                var archivedata = await axios({
                    url: '/api/archive/', method: 'get', headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                var tagdata = await axios({
                    url: '/api/tag/', method: 'get', headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                content += `<form enctype="multipart/form-data"">`;
                content += `<fieldset><label>标题：<input type="text" name="title" required></label></fieldset>`;
                content += `<fieldset><label>友好名：<input type="text" name="friendlyName" required></label></fieldset>`;
                content += `<fieldset><label>文章描述：<textarea name="desc" required></textarea></label></fieldset>`;
                content += `<fieldset><label>是否公开：<select name="public" required>`;
                content += `<option value="1">是</option>`;
                content += `<option value="0"}>否</option>`;
                content += `</select></label></fieldset>`;
                content += '<fieldset><p>归档：</p>';
                for (const archive of archivedata.data) {
                    content += `<label>${archive.name}<input type="checkbox" value="${archive.archiveid}" name="archive"></label>&ensp;`;
                };
                content += `</fieldset>`;
                content += '<fieldset><p>标签：</p>';
                for (const tag of tagdata.data) {
                    content += `<label>${tag.name}<input type="checkbox" value="${tag.tagid}" name="tag"></label>&ensp;`;
                };
                content += `</fieldset><fieldset><label>Markdown文件：<input type="file" name="markdown" required></label></fieldset>`;
                content += `<input type="submit" value="提交">`;
                content += `</form>`;
            } catch (err) {
                displayTip('error', err.message);
                mask.click();
                return;
            };
            break;
        case 'user':
            content += `<form><fieldset><label>用户名：<input type="text" name="username"></label></fieldset>`;
            content += `<fieldset><label>邮箱：<input type="email" name="email"></label></fieldset>`;
            content += `<fieldset><label>密码：<input type="password" name="password"></label></fieldset>`;
            content += `<fieldset><label>账户类型：<select name="level">`;
            content += `<option value="1">普通用户</option>`;
            content += `<option value="0">管理员用户</option>`;
            content += `</select></label></fieldset>`;
            content += `<input type="submit" value="提交">`;
            content += `</form>`;
            break;
        case 'archive':
            content += `<form><fieldset><label>名称：<input type="text" name="name"></label></fieldset>`;
            content += `<fieldset><label>描述：<textarea name="desc"></textarea></label></fieldset>`;
            content += `<input type="submit" value="提交">`;
            content += `</form>`;
            break;
        case 'tag':
            content += `<form><fieldset><label>名称：<input type="text" name="name"></label></fieldset>`;
            content += `<input type="submit" value="提交">`;
            content += `</form>`;
            break;
        case 'comment':
            content += `<form>`;
            content += `<p>去文章里发表吧，在这加什么加</p>`;
            content += `</form>`;
            break;
        default:
            break;
    };
    mask.innerHTML = content;
    document.querySelector('.mask form').addEventListener('submit', function (e) {
        e.preventDefault();
        var button = document.querySelector('.mask form input[type=submit]');
        if (button) {
            button.setAttribute('disabled', 'disabled');
            button.value = '正在上传';
        } else {
            return false;
        };
        var data = new FormData(this);
        axios({
            method: 'post',
            url: `/api/${type}/`,
            data,
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }).then(data => {
            data = data.data;
            if (data.code === 0) {
                displayTip('success', data.message);
                mask.click();
            } else {
                displayTip('error', data.message);
                button.removeAttribute('disabled');
                button.value = '提交';
            }
        }).catch(err => {
            displayTip('error', err.message);
            button.removeAttribute('disabled');
            button.value = '提交';
        });
        return false;
    });
    return false;
}