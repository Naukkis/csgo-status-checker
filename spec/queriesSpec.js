describe('DBqueries', function() {
    var db = require('../queries');
    var Request = require('request');
    var server;
    beforeAll(() => {
        server = require('../server');
    });

    describe('Create user', () => {
    var data = {};
    beforeAll((done) => {
        Request.post({url:'http://localhost:3001/database/createUser',
                    form: {'steamid64':'76561197965321000', 'username': 'testUser', 'email': 'test@user.com'}},
                    (error, response, body) => {
                          data.status = response.statusCode;
                          data.body = JSON.parse(body);
                          done();
                    });
        });
        it('should respond Status 200', () => {
            expect(data.status).toBe(200);
        });
        it('Should get one user', () => {
            expect(data.body.message).toBe('Inserted user');
        });
    });

    describe('Get one user', () => {
    var data = {};
    beforeAll((done) => {
        Request.get('http://localhost:3001/database/getUser/?q=76561197965321000', (error, response, body) => {
            data.status = response.statusCode;
            data.body = JSON.parse(body);
            done();
            });
        });
        it('should respond Status 200', () => {
            expect(data.status).toBe(200);
        });
        it('Should get one user', () => {
            expect(data.body.data.steamid64).toBe('76561197965321000');
            expect(data.body.data.username).toBe('testUser');
            expect(data.body.data.email).toBe('test@user.com');
        });
    });

    describe('GET all users/', () => {
    var data = {};
    beforeAll((done) => {
        Request.get('http://localhost:3001/database/getAllUsers', (error, response, body) => {
            data.status = response.statusCode;
            data.body = JSON.parse(body);
            done();
            });
        });
        it('should respond Status 200', () => {
            expect(data.status).toBe(200);
        });
        it('Should get all users', () => {
            expect(data.body.status).toBe('success');
        });
    });

    describe('Delete user', () => {
    var data = {};
    beforeAll((done) => {
        Request.del('http://localhost:3001/database/removeUser/?q=76561197965321000',
                    (error, response, body) => {
                        data.status = response.statusCode;
                        data.body = JSON.parse(body);
                        done();
                  });
        });
        it('should respond Status 200', () => {

            expect(data.status).toBe(200);
        });
        it('Should delete user', () => {
            expect(data.body.message).toBe(1);
        });
    });

    describe('Adding matches', () => {
      var data = {};
      beforeAll((done) => {
          Request.post({url:'http://localhost:3001/database/addMatch',
          form: {'playerIDs': '76561198060465046,76561198120370069,76561198011319125,76561198151387780,'
                        + '76561197970324744,76561197965321195,76561197965154503,76561198013574321,'
                        + '76561197965297039,76561198014866971',
                 'endScore': '16-10'}},
                   (error, response, body) => {
                          data.status = response.statusCode;
                          data.body = JSON.parse(body);
                          done();
                      });
          });
      it('should respond Status 200', () => {

          expect(data.status).toBe(200);
      });
      it('should add one match', () => {
        console.log(data.body);
        expect(data.body.status).toBe('success')
      });
    });

    describe('bind match to user', () => {
      var data = {};
      beforeAll((done) => {
          Request.post({url:'http://localhost:3001/database/saveMatch',
          form: {'userID': 1, 'matchID': '2'}},
                   (error, response, body) => {
                          data.status = response.statusCode;
                          data.body = JSON.parse(body);
                          done();
                      });
          });
      it('should respond Status 200', () => {
          expect(data.status).toBe(200);
      });
      it('should bind a match to a user', () => {
        console.log(data.body);
        expect(data.body.status).toBe('success')
      });
    });

    describe('get user\'s saved matches', () => {
      var data = {};
      beforeAll((done) => {
          Request.post({url:'http://localhost:3001/database/savedMatches',
                        form: {'steamid64': '76456166'}},
                       (error, response, body) => {
                             data.status = response.statusCode;
                             data.body = JSON.parse(body);
                             done();
                        });
          });
      it('should respond Status 200', () => {
          expect(data.status).toBe(200);
      });
      it('should get user\'s saved matches', () => {
        console.log(data.body);
        expect(data.body.status).toBe('success')
      });
    });


});
