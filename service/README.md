Spartan Missile Strike Service

Development Notes

Dependencies:
  - Redis http://redis.io/
    (If you're developing on windows, you can download and build an unofficial Redis port for win32 from https://github.com/MSOpenTech/redis)
  - Node http://nodejs.org/

Steps:
  - Launch Redis listening on port 6379
  - node start
  - browse to http://localhost:8080 to see API documentation
  - browse to (i.e.) https://localhost:8443/cities to use the API

To run the tests:
 - make test -or- mocha
