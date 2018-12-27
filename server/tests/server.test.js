const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../model/todo');
const {User} = require('../model/user');


const todos =[
    {
        _id: new ObjectID(),
        text : 'First test todo'
    },
    {
        _id: new ObjectID(),
        text: 'Second test todo',
        completed : true,
        completed: 333
    }
];

const users= [{
    _id: new ObjectID(),
    email : 'angela@gmail.com',
    password: '123456789'
},];

var newId = new ObjectID;

//empty the database before each start
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());

    User.remove({}).then(()=>{
        return User.insertMany(users);
    });
});

describe('POST /todos', ()=>{

    it('should create a new todo', (done)=>{
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.text).toBe(text);
            })
            .end((error, resp)=>{
                if(error) {
                  return done();
                }

                Todo.find().then((todos)=> {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should not create to do ', (done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, resp)=>{
                if(error){
                    return done();
                }
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            });
    });
});

describe('GET /todos', () => {
        it('should return all list of todos', (done) => {
            request(app)
                .get('/todos')
                .expect(200)
                .expect((resp) =>{
                    expect(resp.body.todos.length).toBe(2);
                })
                .end((error, resp)=>{
                    if(error){
                        return done(error);
                    }

                    // check the db lenght
                    Todo.find().then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                    }).catch(error => done(error));
                });
        });
});

describe('GET /todos/:id', () => {
    it('Should get todo by a given id', (done) =>{
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((resp)=> {
                expect(resp.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should return 404 if todo not found', (done)=>{
        request(app)
            .get(`/todos/${newId.toHexString()}`)
            .expect(404)
            .expect((resp)=> {
                expect(resp.body).toBeNull;
            })
            .end(done);
    });

    it('Should return 404 for non-object id', (done) =>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .expect((resp)=> {
            expect(resp.body).toBeNull;
        })
        .end(done);
    });
});

describe('DELETE /todos/:id', ()=>{
    it('Should delete a todo', (done) =>{
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.text).toBe(todos[0]._text);
            })
            .end((error, resp)=>{
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(1);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('Should return 404 if todo not found', (done) =>{
        var id = new ObjectID;
        request(app)
        .delete(`/todos/${id.toHexString()}`)
        .expect(404)
        .expect((resp)=>{
            expect(resp.body.text).toBeNull;
        })
        .end(done);
    });

    it('Should return 404 if object id is invalid', (done) =>{
        request(app)
        .delete(`/todos/123`)
        .expect(404)
        .expect((resp)=>{
            expect(resp.body.text).toBeNull;
        })
        .end(done);
    });
});

describe('PATCH /todos/:id', ()=>{

    it('Should update completed to true', (done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({
            completed: true
        })
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.completed).toBe('true');
            expect(resp.body.completedAt).toNotBe(null);
        })
        .end((error, resp)=>{
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((error) => done(error));
        });
    });

    it('Should update completed to false', (done)=>{
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({
            completed: false
        })
        .expect(200)
        .expect((resp)=>{
            expect(resp.body.completed).toBe('false');
            expect(resp.body.completedAt).toBe(null);
        })
        .end((error, resp)=>{
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((error) => done(error));
        });
    });
});

describe('POST /users', ()=>{
    const emailValue = 'angela.babarada@yahoo.com';

    it('should create a new user', (done)=>{
        request(app)
            .post('/users')
            .send({
                email: emailValue,
                password:"12345678"
            })
            .expect(200)
            .expect((resp)=>{
                expect(resp.body.email).toBe(emailValue);
                })
            .end((error, resp)=>{
                if(error) {
                  return done();
                }

                User.find().then((users)=> {
                    expect(users.length).toBe(2);
                    expect(users[1].email).toBe(emailValue);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should not create new user ', (done)=>{
        request(app)
            .post('/users')
            .send({ 
                email: emailValue,
                password:"12345678"})
            .expect(400)
            .end((error, resp)=>{
                if(error){
                    return done();
                }
                User.find().then((users)=>{
                    expect(users.length).toBe(1);
                    done();
                }).catch((error) => done(error));
            });
    });
});