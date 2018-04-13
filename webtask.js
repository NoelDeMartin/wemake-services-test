module.exports = function (context, request, response) {
    var UrlParser = require('url');

    var url = UrlParser.parse(request.url, true);

    if (url.pathname.endsWith('/oauth')) {
        oauth();
    } else {
        login();
    }

    function login() {
        var state = setOAuthState();

        redirect(
            'https://github.com/login/oauth/authorize' +
                '?client_id=' + context.secrets.client_id +
                '&redirect_uri=' + getRedirectUri() +
                '&state=' + state
        );
    }

    function oauth() {
        if (getOAuthState() !== url.query.state) {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ error: 'Invalid oauth state provided' }));

            return;
        }

        require('request')({
            uri: 'https://github.com/login/oauth/access_token',
            method: 'POST',
            form: {
                client_id: context.secrets.client_id,
                client_secret: context.secrets.client_secret,
                code: url.query.code,
                redirect_uri: getRedirectUri(),
                state: url.query.state,
            },
        }, function(error, res, body) {
            if (error) {
                response.statusCode = 404;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ error: error.description || 'An error ocurred' }));
            } else {
                var accessToken = UrlParser.parse('/?' + body, true).query.access_token;

                response.setHeader('Set-Cookie', ['oauth_state=']);
                redirect('https://noeldemartin.github.io/wemake-services-test?access_token=' + accessToken);
            }
        });
    }

    function setOAuthState() {
        var state = Math.random().toString(36).substring(2);
        response.setHeader('Set-Cookie', ['oauth_state=' + state]);

        return state;
    }

    function getOAuthState() {
        var cookies = request.headers.cookie.split(';');
        for (var cookie of cookies) {
            cookie = cookie.trim().split('=');
            var name = cookie[0];
            if (name === 'oauth_state') {
                return decodeURI(cookie[1]);
            }
        }

        return null;
    }

    function getRedirectUri() {
        return encodeURI('https://' + request.headers.host + '/wemake-services-test/oauth');
    }

    function redirect(url) {
        response.setHeader('Location', url);
        response.writeHead(302);
        response.end();
    }
};
