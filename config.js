module.exports = {
    serverPort: 3000,
    theme: 'default',
    website: {
        name: "XYZ-S的个人博客",
        keyword: ['xyz-s'],
        desc: "xyz-s的个人博客"
    },
    auth: {
        secret: 'lightnote',
        expires: '7d',
        cookieExpires: 7 * 24 * 60 * 60 * 1000
    },
    static: {
        maxage: 1000 * 60 * 60
    },
    bodyParser: {
        multipart: true
    },
    view: {
        extension: 'njk',
        map: {
            njk: 'nunjucks'
        }
    },
    mysql: {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'lightnote'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379

    },
    mailSender: {
        host: 'smtp.mxhichina.com',
        secureConnection: true,
        auth: {
            user: 'noreply@xyz-studio.xyz',
            pass: '********'
        }
    }
}