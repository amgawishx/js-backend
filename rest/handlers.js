express = require('express')
models = require('../database/models');

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

function actionType(action) {
    let post = ['add', 'register'];
    let put = ['edit'];
    let _delete = ['delete', 'remove'];
    if (action in post) {
        return 'post';
    }
    else if (action in put) {
        return 'put';
    }
    else if (action in _delete) {
        return 'delete';
    }
    else {
        return;
    }
}

var user = express.Router();
var fetch = express.Router();

user.post('/:user_type/:action/:item', async function (request, response) {
    try {
        var model = models[request.params.user_type];
        if (actionType(request.params.action) != 'post') {
            throw TypeError("Unkown POST method action.");
        }
        await model[request.params.action + request.params.item.capitalize()]
            (request.body);
        response
            .status(200)
            .json({});
    }
    catch (err) {
        console.error(err);
        response
            .status(400)
            .json({ error: err });
    }
});

fetch.get('/:model/:key?/:value?', async function (request, response) {
    try {
        let model = request.params.model;
        if (request.params.key) {
            let query = {};
            query[request.params.key] = request.params.value;
            let payload = await models[model].find(query).toJSON();
            response
                .status(200)
                .json({ payload: payload });
        }
    }
    catch (err) {
        console.error(err);
        response
            .status(400)
            .json({ error: err });
    }
});

module.exports = {
    user: user,
    fetch: fetch,
}