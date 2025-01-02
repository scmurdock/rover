// End: Exersize Code (Your code)
import mocha from 'mocha';
import {expect} from 'chai';
import Rover from '../js/Rover.js';
// const chai = require('chai');
// const Rover = require('../js/Rover');
// Test Specs


// const expect = chai.expect;

describe('Mars Rover', function() {
  let rover1 = null;
  beforeEach(function() {
    rover1 = new Rover([2,2], 'N');
  });
	describe('When the Mars Rover is initialized', function() {
  	it('should set the starting location', function() {
      expect(rover1.location).to.deep.equal([2,2]);
    });
    it('should set the starting direction', function() {
    	expect(rover1.direction).to.equal('N');
    });
  });
  describe('When the rover receives commands', function() {
  	it('should store the commands', function() {
      rover1.command(['F', 'F', 'B']);
      expect(rover1.commands).to.deep.equal(['F', 'F', 'B']);
    });
    it('should handle valid commands', function() {//add positive check
    	const status = rover1.command(['F']);//should go North one tile
      
      expect(status).to.deep.equal({
      	status: 'OK',
        loc: [2,1],
        dir: 'N'
      });
    });    
    it('should handle invalid commands', function() {
    	const status = rover1.command(['X']);
      
      expect(status).to.deep.equal({
      	status: 'INVALID_COMMAND',
        loc: [2,2],
        dir: 'N'
      });
    });
  });
  describe('When the rover executes valid commands', function() {
  	describe('When facing north', function() {
    	describe('When moving forward', function() {
      	it('should move north one tile', function() {
          const status = rover1.command(['F']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,1],
            dir: 'N'
          });
        });
      });
      describe('When moving backward', function() {
      	it('should move south one tile', function() {
          const status = rover1.command(['B']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,3],
            dir: 'N'
          });
        });
      });
      describe('When turning left', function() {
      	it('should be facing west', function() {
          const status = rover1.command(['L']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'W'
          });
        });
      });
      describe('When turning right', function() {
      	it('should be facing east', function() {
          const status = rover1.command(['R']);
          expect(status).to.deep.equal({
            status: 'OK',
            loc: [2,2],
            dir: 'E'
          });
        });
      });
    });
  });
  describe('When the rover encounters obstacles', function() {
  	describe('When encountering a mountain', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['L', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,2],
          dir: 'W'
        });
      });
    });
    describe('When encountering a crevasse', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['F', 'F', 'R', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'E'
        });
      });
    })
    describe('When encountering the edge of the world', function() {
    	it('should stop and return status', function() {
      	const status = rover1.command(['F', 'F', 'F']);
        expect(status).to.deep.equal({
          status: 'OBSTACLE',
          loc: [2,0],
          dir: 'N'
        });
      });
    });
  });
});
