import * as express from 'express';
import * as models from '../database/models';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

interface options {
    preprocess: object,
    postprocess: object,
}
interface config {
    parameters: Array<any>,
    super: object,
}

type POST_ACTIONS = 'add' | 'register';
type PUT_ACTIONS = 'edit';
type DELETE_ACTIONS = 'remove' | 'delete';
type ACTIONS = POST_ACTIONS | PUT_ACTIONS | DELETE_ACTIONS;

function actionType(action: ACTIONS): string | null {
    let post: POST_ACTIONS;
    let put: PUT_ACTIONS;
    let _delete: DELETE_ACTIONS;
    if (action === post) {
        return 'post';
    } else if (action === put) {
        return 'put';
    } else if (action === _delete) {
        return 'delete';
    } else {
        return;
    }
}

var app = express();
app.use(express.json());

var user = app.Router();
var fetch = app.Router();

user.post('/:user_type/:action/:item', async function name(request, response) {
    try {
        var model;
        switch (request.params.user_type) {
            case 'student':
                model = models.Student;
                break;
            case 'tutor':
                model = models.Tutor;
                break;
        }
        if (actionType(request.params.action) != 'post') {
            throw TypeError("Unkown POST method action.");
        }
        await model[request.params.action + request.params.item.capitalize()](
            request.body
        );
        response.json(JSON.stringify({status: 200}));
    }
    catch (err) {
        console.error(err);
        return -1;
    }
});