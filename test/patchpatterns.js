var patchPatterns = require('../lib/patchpatterns')

var commit = require("./mocks/commit.json")

var patches = commit.files.map(function(file) { return file.patch; });

describe('lib/patchPatterns()', function() {
  //var patterns = require('../patterns');
  
  it('counts properly', function(done) {
    var results = patchPatterns(patches);
    // Open
    results.curly_open.counts.added.should.equal(10);
    results.curly_open.counts.removed.should.equal(4);
    results.curly_open.counts.delta.should.equal(6);

    // Close
    results.curly_close.counts.added.should.equal(9);
    results.curly_close.counts.removed.should.equal(3);
    results.curly_close.counts.delta.should.equal(6);

    done();
  });  
});