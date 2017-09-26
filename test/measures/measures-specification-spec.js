const chai = require('chai');
const assert = chai.assert;
var request = require('sync-request');

var measuresData = require('../../index.js');

describe('measures specification', function () {

  it('should have valid specification links', function (done) {
    this.timeout(300000); // 5 minutes timeout.

    var measures = measuresData.getMeasuresData();
    var specifications = measures
      .map(m => ({measureId: m.measureId, measureSpecification: m.measureSpecification}))
      .filter(s => !!s.measureSpecification);

    var statuses = [];
    specifications.forEach(s => {
      Object.keys(s.measureSpecification).forEach(key => {
        var url = s.measureSpecification[key];
        console.log("Checking: ", url);
        var body = request('HEAD', url);
        var valid = /4\d\d/.test(body.statusCode) === false;
        if (!valid) {
          statuses.push({measureId: s.measureId, submissionMethod: key, httpStatus: body.statusCode})
        }

      })
    });

    if (statuses.length > 0) {
      console.table(statuses);
    }

    assert.equal(0, statuses.length, 'One or more measure specifications link is invalid');

    done();
  });


});
