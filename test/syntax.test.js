
describe('syntax.json', function(){
  var endpoints = require('../syntax');
  
  it('is a valid json doc',  function(done) {
    endpoints.should.be.a('object');
    done();
  });  
})