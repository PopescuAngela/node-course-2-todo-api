const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../model/todo');

const todos =[
    {text : 'First test todo'},
    {text: 'Second test todo'}
]

//empty the database before each start
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
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