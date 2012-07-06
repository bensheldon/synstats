var async       = require('async');

module.exports = function patchPatterns(patches, patterns) {
  var patterns = patterns || require('../patterns.json');
  var patchPatterns = [];

  // MAP
  patchPatterns = patches.map(function(patch) {
    patch = patch.replace(/@@[\-,+ 0-9]*?@@/mg, '\n');
    var lines = patch.split('\n');
    var plusLines = [];
    var minusLines = [];
    var i;
    var reMinus = /^[ ]*-/;
    var rePlus = /^[ ]*\+/;
    // TODO: remove the leading + or -
    for (i = 0; i < lines.length; i += 1) {
      if (reMinus.test(lines[i])) {
        minusLines.push(lines[i]);
      } else if (rePlus.test(lines[i])) {
        plusLines.push(lines[i]);
      }
    }

    var counts = [];

    var re;
    var plusCount;
    var minusCount;
    var i;
    var pIndex;

    for(var pKey in patterns) {
      plusCount = 0;
      for (i = 0; i < plusLines.length; i += 1) {
        re = new RegExp(patterns[pKey].pattern, 'gm');
        while (re.test(plusLines[i])) {
          plusCount += 1;
        }
      }
      minusCount = 0;
      for (i = 0; i < minusLines.length; i += 1) {
        re = new RegExp(patterns[pKey].pattern, 'gm');
        while (re.test(minusLines[i])) {
          minusCount += 1;
        }
      }
      
      counts[pKey] = {
        added: plusCount,
        removed: minusCount,
        delta: plusCount - minusCount
      };
    };

    return counts;
  });

 // reset our pattern counts
  for(var pKey in patterns) {
    patterns[pKey].counts = {
      added: 0,
      removed: 0,
      delta: 0
    }
  }

  // REDUCE
  var patterns = patchPatterns.reduce(function(reduction, patch){
    for(var pKey in patterns) {
      patterns[pKey].counts.added += patch[pKey].added;
      patterns[pKey].counts.removed += patch[pKey].removed;
      patterns[pKey].counts.delta += patch[pKey].delta;
    }
    return patterns;
  }, patterns);

  return patterns;
}