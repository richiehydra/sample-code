"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = require("crypto");
// express.js code calls the service
// serve swagger schema (OAS3) over /schema endpoint
// N tier architecture
// Dependency injection
class UserService {
    constructor(db) {
        this.db = db;
    }
    createUser({ name }) {
        return this.db.createUser({
            id: (0, crypto_1.randomUUID)(),
            name,
        });
    }
}
class InMemoryUserRepository {
    constructor(users = []) {
        this.users = users;
    }
    ;
    createUser({ name, id }) {
        const user = {
            id,
            name
        };
        this.users.push(user);
        return Promise.resolve(user);
    }
    ;
    getAllUsers() {
        const users = JSON.parse(JSON.stringify(this.users));
        return Promise.resolve(users);
    }
}
const app = (0, express_1.default)();
const PORT = 5000;
const todo = [];
const db = new InMemoryUserRepository();
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    db.getAllUsers().then(users => res.json(users));
    // res.json({ todo });
});
app.post('/', (req, res) => {
    const name = req.body.name;
    // console.log(data);
    // todo.push(data);
    // console.log(todo)
    db.createUser({ name }).then(() => {
        res.status(201).json({ message: 'Data received successfully' });
    });
});
app.listen(PORT, () => {
    console.log(`The App is Running at ${PORT}`);
});
