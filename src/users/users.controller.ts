import http from "http";
import UsersService from "./users.service.js";
import {ControllerHandler} from "../lib/models/controller-handler.type.js";
import {CustomRequest} from "../lib/models/request.type.js";


interface UsersControllerEndpoints {
    getUsers: ControllerHandler;
    getUser: ControllerHandler;
    createUser: ControllerHandler;
    updateUser: ControllerHandler;
    deleteUser: ControllerHandler;
}

class UsersController implements UsersControllerEndpoints {
    public async getUsers(req: CustomRequest, res: http.ServerResponse) {
        const users = await UsersService.find();

        res.end(users);
    }
    public async getUser(req: CustomRequest, res: http.ServerResponse) {
        res.end('GET users/:id');
    }

    public async createUser(req: CustomRequest, res: http.ServerResponse) {
        res.end('POST users/');
    }

    public async updateUser(req: CustomRequest, res: http.ServerResponse) {
        res.end('PUT users/:id');
    }

    public async deleteUser(req: CustomRequest, res: http.ServerResponse) {
        res.end('DELETE users/:id');
    }
}

export default new UsersController();