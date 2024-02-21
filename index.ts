import express from 'express';
import bodyparser from 'body-parser';
import { randomUUID } from 'crypto';


type User = {
  id: string;
  email: string;
};

interface UserRepository {
  createUser: ({ name, id }: {name: string; id: string;}) => Promise<User>;
  getAllUsers: () => Promise<Array<User>>;
}


interface IUserService {
  createUser: ({ name }: {name: string;}) => Promise<User>;
  getAllUsers: () => Promise<Array<User>>;
}

// express.js code calls the service
// serve swagger schema (OAS3) over /schema endpoint

// N tier architecture
// Dependency injection

class UserService implements IUserService {
  constructor(private db: UserRepository) {}
  createUser({ name }: { name: string }): Promise<User> {
    return this.db.createUser({
      id: randomUUID(),
      name,
    });
  }
}

class InMemoryUserRepository implements UserRepository {
constructor(private users: User[] = []){};

createUser({ name, id }: { id: string; name: string; }): Promise<User> {
  const user = {
    id,
    name
  };
  this.users.push(user);
  return Promise.resolve(user);
};
getAllUsers(): Promise<User[]> {
  const users = JSON.parse(JSON.stringify(this.users));
  return Promise.resolve(users);
}
}


const app = express();
const PORT = 5000;
const todo = [];
const db = new InMemoryUserRepository();

app.use(bodyparser.json()); 

app.get('/', (req: any, res: any) => {
  db.getAllUsers().then(users => res.json(users));
  // res.json({ todo });
});

app.post('/', (req: any, res: any) => {
  const name = req.body.name;
  // console.log(data);
  // todo.push(data);
  // console.log(todo)
  db.createUser({name}).then(() => {
    res.status(201).json({ message: 'Data received successfully' });
  });
});



app.listen(PORT, () => {
  console.log(`The App is Running at ${PORT}`);
});


