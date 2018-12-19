const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../model/todo');

//empty the database before each start
beforeEach((done)=>{
    Todo.remove({}).then(()=>done());
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
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((error)=>done(e));
            });
    });

    it('should not create to do ', (done)=>{
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, resp)=>{
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(1);
                }).catch((error) => done(error));
            });
    });
});