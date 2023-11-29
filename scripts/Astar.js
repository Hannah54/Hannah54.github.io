function heuristics(a, b) {
	return Math.abs(a.column - b.column) + Math.abs(a.row - b.row)
}

isRunning = true

robotWay = true
var openSet = []

function Astar() {

	console.log("running A*")
	var solved = false
	var openSet = [tiles[start[0]][start[1]]]  // this is changed in these functinons :-  handelMouseMoveStart, resetMaze 
	var closedSet = []
	var isRunning = true

	while (isRunning) {

		if (openSet.length == 0) {
			console.log("open set is empty: ", openSet.length);
			robotWay = false
			// alert("open set is empty thus no solution")
			break
		}
		if (solved == true) {
			solved = false
			console.log("solved = true")
			openset = []
			break
		}
		if (!isRunning) {
			console.log("returning because isRunning is false")
			break
		}
		isRunning = true

		//  First we will find the node in the openset having the lowest f value
		minIndex = 0
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[minIndex].f) {
				minIndex = i
			}
		}

		currentNode = openSet[minIndex]

		if (currentNode.column == tiles[end[0]][end[1]].column && currentNode.row == tiles[end[0]][end[1]].row) {
			solved = true
			isRunning = false
		}
		
		if (closedSet.length > tileRowCount * tileColumnCount) {
			isRunning = false
			solved = false
			console.log("Algorithm checking for more than possible case this is a bug and needs to be fixed")
			break
		}

		removeElmentFromArray(openSet, currentNode)
		closedSet.push(tiles[currentNode.column][currentNode.row])

		var neighbours = currentNode.neighbours
		for (var i = 0; i < neighbours.length; i++) {
			if (tiles[neighbours[i].column][neighbours[i].row].state != "wall" && (tiles[neighbours[i].column][neighbours[i].row].state != "end" || tiles[neighbours[i].column][neighbours[i].row] === tiles[end[0]][end[1]]) && !closedSet.includes(tiles[neighbours[i].column][neighbours[i].row])) {
				var tempG = tiles[currentNode.column][currentNode.row].g + heuristics(tiles[currentNode.column][currentNode.row], tiles[neighbours[i].column][neighbours[i].row])
				var newPathBetter = false

				if (openSet.includes(tiles[neighbours[i].column][neighbours[i].row])) {
					//  this block will run only of the node is already in the open set meaning we already have a path for this node
					//  the hurestic will remain the same but the value of g will be differet
					// we should change this value only if the g value is lesser than the already existing g value
					if (tempG < tiles[neighbours[i].column][neighbours[i].row].g) {
						newPathBetter = true
						tiles[neighbours[i].column][neighbours[i].row].g = tempG
					}
				} else {
					newPathBetter = true // since this will be the only path we have for the node
					tiles[neighbours[i].column][neighbours[i].row].g = tempG
					openSet.push(tiles[neighbours[i].column][neighbours[i].row])
				}

				if (newPathBetter) {
					tiles[neighbours[i].column][neighbours[i].row].h = heuristics(tiles[neighbours[i].column][neighbours[i].row], tiles[end[0]][end[1]])
					tiles[neighbours[i].column][neighbours[i].row].f = tiles[neighbours[i].column][neighbours[i].row].g + tiles[neighbours[i].column][neighbours[i].row].h
					tiles[neighbours[i].column][neighbours[i].row].previous = tiles[currentNode.column][currentNode.row]
				}
			}
		}
	}
};

function showPath() {
	var temp = tiles[end[0]][end[1]];
	var temp_start = tiles[start[0]][start[1]];

	// if(isRobotRunning == false){
	// 	start[0] = temp_start.column;
	// 	start[1] = temp_start.row;
	// 	return;
	// }
	console.log("openSet in showPath: ", openSet);
	//if do not find robot way to the endPoint
	// if(openSet.length == 1){
	// 	console.log("openSet = 0");
	// 	// spot.pop();
	// 	// start[0] = start[0];
	// 	// start[1] = start[1];
	// 	return;
	// }


	console.log("Show path was called ");
	
	tiles[end[0]][end[1]].state = "end";
  
	return new Promise((resolve) => {
	  const abc = () => {
		temp = tiles[end[0]][end[1]];

		

		if (temp == temp_start || isRobotRunning == false) {
			console.log(start[0], start[1]);
			resolve(); // Resolve the promise when finished
			return;
		}
  
		while (temp.previous != temp_start) {
		  temp = temp.previous;
		}
			
		//robot through colorBlob
		if(tiles[temp.column][temp.row].state === "blob"){
			//print on web that robot run through a important cell
			displayNotice("Robot ran through an important cell at (" + (temp.row+1) + ", " + (temp.column+1) + ")");
			tiles[temp.column][temp.row].state = "enterBlob";
		}
		else{
			tiles[temp.column][temp.row].state = "start";
			
		}
		//return colorBlob pink color
		if(tiles[temp.column][temp.row].previous.state === "enterBlob"){
			tiles[temp.column][temp.row].previous.state = "blob";
		}else{
			tiles[temp.column][temp.row].previous.state = "empty";
		}

		temp_start = temp;
		start[0] = temp_start.column;
		start[1] = temp_start.row;
  
		setTimeout(abc, 500);
	  };
  
	  abc();
	});
  }

function displayNotice(message) {
    var noticeDiv = document.getElementById("notice");

    if (noticeDiv) {
        // Append the new notice message to the existing content
        noticeDiv.innerHTML += "<p>" + message + "</p>";
    } else {
        console.log(message);
    }
}

let count = 1

function runRobot(){
	if(isRobotRunning == false){
		isRobotRunning = true;
	}
	Astar();
	showPath().then(() => {
		if(isRobotRunning == false){
		}
		else if(spot.length > 1){

			spot.pop();
			
			end = spot[spot.length-1];
			console.log(count+1);
			runRobot();
		}
	  });
}

let isRobotRunning = true; // Declare isRunning as a global variable


function stopRobot() {
	isRobotRunning = false;
    
	console.log(isRobotRunning);
}