'use strict'

beforeEach(function() {
  this.simpleCatch = function(err) {
    console.log(err);
  };

  this.createMockResponseRenderWithAssertions = function(done) {
    return {
      render: function(view, data, callback) {
        expect(mockResponse.renderView).toEqual('question/show');
        expect(mockResponse.renderData).toEqual(jasmine.any(Question));

        if(this.renderArgumentsNum == 2) {
          // The data attr is optional
          this.renderCallback = arguments[1];
        } else {
          this.renderData = arguments[1];
          this.renderCallback = arguments[2];
        }
        done();
      }
    };
  }
});
