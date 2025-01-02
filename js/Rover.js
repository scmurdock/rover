/*
  Mars Rover
  
  You are to build the backing logic behind an API to navigate a bidirectional rover along a two dimensional cartesian plain (x,y) representation of the planet Mars. Each point will include a topographical label designating the terrain at that location.
  
  Map Example:

  (0,0)
   	['P', 'P', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'C', 'P'],
	  ['P', 'M', 'P', 'P', 'P'],
	  ['P', 'M', 'P', 'P', 'P']
                          (4,4)

  Details:
  
  - The rover when initialized will be provided an initial starting point (x, y) as well as a starting direction (N, S, E, W) that the rover is facing
  - The rover should receive its commands as a string array. e.g. ['F', 'B', 'L', R']
  - The rover may move forward and backward with the (F, B) character commands
  - The rover may turn left and right with the (L, R) character commands
  - The rover should execute all given commands in sequence
    - If: The rover is given a valid command
      - Then: Update the rovers direction or location
    - If: All commands have been executed 
      - Then: return an OK status along with the location and direction
    - If: The rover is provided a command that would result in the rover entering terrain that is an obstacle
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
    - If: The rover is provided an invalid command
      - Then: return an INVALID_COMMAND status code along with the last successful location and direction of the rover
    - If: The rover is given a command that would result in leaving the edge of the world
      - Then: return an OBSTACLE status code along with the last successful location and direction of the rover
  
  Further Instructions:
  
  - Implement your code to make the below tests pass
  - Feel free to modify any code you wish to suit your preference. Also, don't feel limited to methods provided feel free add more (encouraged)
  - If you modify exercise code (i.e use functional instead of class based Rover) you'll need to modify the tests accordingly
  - Read the tests! They have helpful in better understanding the requirements
  
  Extra Credit:

  The below extra credit is optional (really).
  
  - add a moveTo() method that takes the (x,y) coordinates to move the rover along the most optimal path bypassing obstacles
  - https://en.wikipedia.org/wiki/A*_search_algorithm
  - https://en.wikipedia.org/wiki/Dijkstra's_algorithm
*/
const TERRAIN_TYPES = {
	'P': {
  	obstacle: false,
    description: 'plains'
  },
  'M': {
  	obstacle: true,
    description: 'mountains'
  },
  'C': {
  	obstacle: true,
    description: 'crevasse'
  }
};

const STATUS_CODES = ['OK', 'OBSTACLE', 'INVALID_COMMAND'];

// top left corner is (X:0, Y:0)
// bottom right is (X:4, Y:4)
const WORLD = [
	['P', 'P', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'C', 'P'],
	['P', 'M', 'P', 'P', 'P'],
	['P', 'M', 'P', 'P', 'P']
];

const DIRECTIONS = ['N', 'S', 'E', 'W'];
const DIRECTION_FROM_DEGREES = {0:'N',90:'E',180:'S',270:'W'};//map degrees to direction
const DEGREES_FROM_DIRECTION = {'N':0,'E':90,'S':180,'W':270};//map direction to degrees
const COMMANDS = ['L', 'R', 'F', 'B'];

// Start: Exercise Code (Your Code)

// YOUR CODE BELOW
// NOTE: cntrl + enter to run tests
// Note: integrated firebug for console logs
export default class Rover {  
	location=[0,0];//store the location as X,Y coordinates
  direction='N';//store the direction as a 'N','S','E','W' value
  degrees=0;//store the current direction the rover is facing in degrees 0-360
  commands=[];//store the history of commands
  lastXOrY='X';//store most recent axis that was attempted in case obstacle is located
  lastValue=0;//store most recent amount that was attempted in case obstacle is located
	constructor(location, direction) {
	  let status=STATUS_CODES[0];//default OK status -- changes if invalid commands are passed
		!Array.isArray(location) && (status=STATUS_CODES[2]);//INVALID_COMMAND : location is not in array format
    !DIRECTIONS.includes(direction) && (status=STATUS_CODES[2]);//INVALID_COMMAND: direction not valid
    if (status==STATUS_CODES[0]){//Passes validation: assign location and degrees based on constructor values 
	  	this.location=location
  	  this.degrees=DEGREES_FROM_DIRECTION[direction];
      this.direction=direction;
    }
  }
  command(newCommands) {
    let status=STATUS_CODES[0];//default OK status -- changes if invalid commands are passed
  	!Array.isArray(newCommands) && (status=STATUS_CODES[2]);//INVALID_COMMAND
  	const validCommands=newCommands.filter(newCommand=>COMMANDS.includes(newCommand));//filter only valid commands
  	this.commands.push(...validCommands);
    validCommands.length!==newCommands.length && (status=STATUS_CODES[2]);//INVALID_COMMAND -- //fail and return INVALID_COMMAND if any invalid commands sent
    validCommands.forEach(validCommand=>{
    	switch(validCommand){

        //The unit tests made the assumption that Left/Right simply rotates, without forward movement
        // The unit tests made the assumption that going North means decreasing in the Y direction

      	case 'L':
        	this.degrees-=90;//shift 90 degrees counter-clockwise
        	break;
        case 'R':
        	this.degrees+=90;//shift 90 degrees clockwise
					break;
        case 'F'://no change in direction
            switch(this.degrees){
              case 0://North
                this.location[1]>0 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the top of the map
                this.location[1]>0 && this.move('Y',-1);//(this.location[1]-=1);//shift North one
                break;
              case 90://East
                this.location[0]<4 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the right edge of the map
                this.location[0]<4 && this.move('X',1);//(this.location[0]+=1);//shift East one 
                break;
              case 180://South
                this.location[1]<4 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the bottom of the map
                this.location[1] <4 && this.move('Y',1);//(this.location[1]+=1);//shift South one
                break
              case 270://West
                this.location[0]>0 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the left edge of the map
                this.location[0]>0 && this.move('X',-1);//(this.location[0]-=1);//shift West one
                break;
            }     
        	break;
        case 'B'://go in reverse
          switch(this.degrees){
            case 0://North
              this.location[1]<4 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the bottom of the map
              this.location[1]<4 && this.move('Y',1);//(this.location[1]+=1);//shift south one
              break;
            case 90://East
              this.location[0]>0 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the left edge of the map  
              this.location[0]>0 && this.move('X',-1);//(this.location[0]-=1);//shift West one 
              break;
            case 180://South
              this.location[1]>0 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the top of the map
              this.location[1] > 0 && this.move('Y',-1);//(this.location[1]-=1);//shift North one
              break
            case 270://West
              this.location[0]<4 || (status=STATUS_CODES[1]);//OBSTACLE -- fail if at the right edge of the map
              this.location[0]<4 && this.move('X',1);//(this.location[0]+=1);//shift East one
              break;
          }     
          break;      
      }
      this.degrees<0 && (this.degrees+=360);//convert from negative to positive, (ex: -90 becomes 270/West)
      this.degrees>360 && (this.degrees-=360);//convert from over 360 to a standard direction (ex: 450 becomes 90/East)
      this.direction=DIRECTION_FROM_DEGREES[this.degrees];//update the direction based on the degrees
      if(TERRAIN_TYPES[WORLD[this.location[1]][this.location[0]]].obstacle){//check if the new location is an obstacle
        status=STATUS_CODES[1];//OBSTACLE
        this.undo();//undo the last move
      }
    })
		const returnStatus={
    	status,
      loc:this.location,
      dir:DIRECTION_FROM_DEGREES[this.degrees],
    };
    console.log(`Return status ${JSON.stringify(returnStatus)}`);
    return returnStatus;
  }

  move(xOrY,value){
    this.lastXOrY=xOrY;
    this.lastValue=value;
    if(xOrY==='X'){
      this.location[0]+=value;
    }else if(xOrY==='Y'){
      this.location[1]+=value;
    }    
  }

  undo(){
    if(this.lastXOrY==='X'){
      this.location[0]-=this.lastValue;
    }else if(this.lastXOrY==='Y'){
      this.location[1]-=this.lastValue;
    }
  }
}

