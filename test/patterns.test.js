describe('patterns.json', function() {
  var patterns = require('../patterns.json');

  it('is a valid json doc', function(done) {
    patterns.should.be.a('object');
    done();
  });  
});