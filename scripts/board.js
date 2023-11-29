//  This fill contans all the Board

let canvas;
let ctx;
let resetButton

let threshold = 0.2;

const WIDTH = 1200;
const HEIGHT = 800;

let isRunning = false


tileRowCount = 10   //row number
tileColumnCount = 10

cellSeperation = 1

tileW = 20; //box width
tileH = 20;

let boundX = 0
let boundY = 0

var start = [1,1]
var end = []
var spot = []

var tiles = []


function handleSubmit(submitType) {
    // Get the input values when the button is clicked
    var rowsValue = document.getElementById("rowsInput").value;
    var columnsValue = document.getElementById("columnsInput").value;

    var startRowValue = document.getElementById("startRowInput").value-1;
    var startColumnValue = document.getElementById("startColumnInput").value-1;

    var hazardRowValue = document.getElementById("hazardRowInput").value-1;
    var hazardColumnValue = document.getElementById("hazardColumnInput").value-1;

    var endRowValue = document.getElementById("endRowInput").value-1;
    var endColumnValue = document.getElementById("endColumnInput").value-1;

    var colorBlobRowValue = document.getElementById("colorBlobRowInput").value-1;
    var colorBlobColumnValue = document.getElementById("colorBlobColumnInput").value-1;

    // Call the functions to handle the changes
    if (submitType == 'mapSize') {
        handleRowChange(rowsValue);
        handleColumnChange(columnsValue);
        // Display the size of the map
        displayMapSize();
    } else if (submitType == 'startPoint') {
        handleStartPoint(startRowValue, startColumnValue);
    }
    else if (submitType == 'hazardPoint') {
        handleHazardPoint(hazardRowValue, hazardColumnValue);
    }
    else if (submitType == 'endPoint') {
        handleEndPoint(endRowValue, endColumnValue);
    }
    else if (submitType == 'colorBlobPoint') {
        handleColorBlobPoint(colorBlobRowValue, colorBlobColumnValue);
    }
}

function displayMapSize() {
    // Get the input values
    var rowsValue = document.getElementById("rowsInput").value;
    var columnsValue = document.getElementById("columnsInput").value;

    // Display the size of the map
    document.getElementById("mapSizeDisplay").innerHTML = "(" + rowsValue + "," + columnsValue + ")";
}


function handleRowChange(rows) {
    rows = rows > 1 ? rows : 1
    tiles = []
    tileRowCount = rows
    canvas.height = (tileH + cellSeperation) * (tileRowCount) - cellSeperation
    canvas.width = (tileW + cellSeperation) * (tileColumnCount) - cellSeperation

    for (var c = 0; c < tileColumnCount; c++) {
        tiles[c] = []
        for (var r = 0; r < tileRowCount; r++) {
            tiles[c][r] = { x: c * (tileW + cellSeperation), y: r * (tileH + cellSeperation), state: "empty", h: 0, f: 0, g: 0, column: c, row: r }
        }
    }

    //  Adding neighbours to the tiles
    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            var neighbours = []
            if (c > 0) { neighbours.push(tiles[c - 1][r]) }
            if (r > 0) { neighbours.push(tiles[c][r - 1]) }
            if (c < tileColumnCount - 1) { neighbours.push(tiles[c + 1][r]) }
            if (r < tileRowCount - 1) { neighbours.push(tiles[c][r + 1]) }

            tiles[c][r].neighbours = neighbours
        }
    }
}

function handleColumnChange(columns) {
    columns = columns > 0 ? columns : 1
    tiles = []
    tileColumnCount = columns
    canvas.height = (tileH + cellSeperation) * (tileRowCount) - cellSeperation
    canvas.width = (tileW + cellSeperation) * (tileColumnCount) - cellSeperation
    for (var c = 0; c < tileColumnCount; c++) {
        tiles[c] = []
        for (var r = 0; r < tileRowCount; r++) {
            tiles[c][r] = { x: c * (tileW + cellSeperation), y: r * (tileH + cellSeperation), state: "empty", h: 0, f: 0, g: 0, column: c, row: r }
        }
    }

    //  Adding neighbours to the tiles
    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            var neighbours = []

            if (c > 0) { neighbours.push(tiles[c - 1][r]) }
            if (r > 0) { neighbours.push(tiles[c][r - 1]) }
            if (c < tileColumnCount - 1) { neighbours.push(tiles[c + 1][r]) }
            if (r < tileRowCount - 1) { neighbours.push(tiles[c][r + 1]) }

            tiles[c][r].neighbours = neighbours
        }
    }
}

//handle startPoint
function handleStartPoint(r, c) {

    if(r < tileRowCount && c < tileColumnCount){

        if (tiles[c][r].state !== "end") {
            tiles[start[0]][start[1]].state = "empty";
            start[0] = c;
            start[1] = r;
            openSet = [tiles[start[0]][start[1]]]; // only for Astar
            tiles[c][r].state = "start";
            console.log("changing the start position");
        }
    }
}

//handle hazardPoint
function handleHazardPoint(r,c) { //(c != boundX || r != boundY) && 
    if (tiles[c][r].state != "start" && tiles[c][r].state != "end" && tiles[c][r].state != "blob") {
        tiles[c][r].state = tiles[c][r].state == "empty" ? "wall" : "empty";
        boundX = c;
        boundY = r;
    }
}

//handle endPoint

function handleEndPoint(r, c) {
    if (r < tileRowCount && c < tileColumnCount) {
        if (tiles[c][r].state !== "start") {
            if (tiles[c][r].state === "empty") {
                // If the tile is currently empty, set it to 'end' and add [c, r] to spot list
                tiles[c][r].state = "end";
                spot.push([c, r]);
                console.log("changing the end position");
            } else {
                // If the tile is not empty, set it to 'empty' and remove [c, r] from spot list
                tiles[c][r].state = "empty";
                spot = spot.filter(item => !(item[0] === c && item[1] === r));
                console.log("changing the empty position");
            }
            console.log("spot", spot[spot.length - 1]);
            end[0] = spot[spot.length - 1][0]
            end[1] = spot[spot.length - 1][1]
            // console.log("end", end[0]);
        }
    }
}

function handleColorBlobPoint(r, c){
    if (tiles[c][r].state != "start" && tiles[c][r].state != "end" && tiles[c][r].state != "wall") {
        tiles[c][r].state = tiles[c][r].state == "empty" ? "blob" : "empty";
        boundX = c;
        boundY = r;
    }
}


function handleMouseMoveEnd(e) {
    let x = e.pageX - canvas.offsetLeft;
    let y = e.pageY - canvas.offsetTop;
    console.log("end is being moved")
    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            if (c * (tileW + cellSeperation) < x && x < c * (tileW + cellSeperation) + tileW && r * (tileH + cellSeperation) < y && y < r * (tileH + cellSeperation) + tileH & (c != start[0] || r != start[1])) {
                if (tiles[c][r].state != "start") {
                    tiles[end[0]][end[1]].state = "empty"
                    end[0] = c
                    end[1] = r
                    tiles[c][r].state = "end"
                }
            }
        }
    }
}


//...
function handleCellSeperationChange(value) {
    value = value >= 0 ? value : 0
    cellSeperation = Number(value)
    console.log("Cell Seperation = ", cellSeperation)
    canvas.height = (tileH + cellSeperation) * (tileRowCount) - cellSeperation
    canvas.width = (tileW + cellSeperation) * (tileColumnCount) - cellSeperation

    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            tiles[c][r].x = c * (tileW + cellSeperation)
            tiles[c][r].y = r * (tileH + cellSeperation)


        }
    }
}


for (var c = 0; c < tileColumnCount; c++) {
    tiles[c] = []
    for (var r = 0; r < tileRowCount; r++) {
        tiles[c][r] = { x: c * (tileW + cellSeperation), y: r * (tileH + cellSeperation), state: "empty", h: 0, f: 0, g: 0, column: c, row: r }
    }
}

//find path
//  Adding neighbours to the tiles
//algorithm run
const handleNeighboursChange = () => {
    // var selector = document.getElementById("Neighbours").value
    console.log("inti neighbours was called")
    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            var neighbours = []
            // if (selector === "4-Adjcent Neighbours" || selector === "All 8 Neighbours") {
            if (c > 0) { neighbours.push(tiles[c - 1][r]) }
            if (r > 0) { neighbours.push(tiles[c][r - 1]) }
            if (c < tileColumnCount - 1) { neighbours.push(tiles[c + 1][r]) }
            if (r < tileRowCount - 1) { neighbours.push(tiles[c][r + 1]) }
            // }
            // if (selector === "Diagonal Neighbours" || selector === "All 8 Neighbours") {
            //     if (c > 0 && r > 0) { neighbours.push(tiles[c - 1][r - 1]) }
            //     if (c > 0 && r < tileRowCount - 1) { neighbours.push(tiles[c - 1][r + 1]) }
            //     if (c < tileColumnCount - 1 && r > 0) { neighbours.push(tiles[c + 1][r - 1]) }
            //     if (c < tileColumnCount - 1 && r < tileRowCount - 1) { neighbours.push(tiles[c + 1][r + 1]) }
            // }
            tiles[c][r].neighbours = neighbours
        }
    }
}

handleNeighboursChange()

    var img = {
        "start": "C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/robot.png",
        "end": "C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "wall":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "empty":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "visited":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "open":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "curent":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "path":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "frozen":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "left":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "down":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "right":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "up":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
    
        "neighbour":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "blob":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png",
        "enterBlob":"C:/Users/phanh/Documents/mobile_robot_controller/hình ảnh/end.png"
    }; 

//color the cells
function rect(x, y, w, h, state) {
    //  draws a rectangle as per the given arguments
    // console.log("state = ", state)
    if (images[state]){
        var img = new Image();
        img.src = images[state];
        ctx.drawImages(img, x, t, w, h);
    }else{
        ctx.fillRect(x, y, w, h);
    }
}


rect(x, y, width, height, "start");

function clear() {
    // console.log("clearing the canvas")
    ctx.clearRect(0, 0, WIDTH, HEIGHT)
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------
const draw = async () => {
    clear()
    // console.log("drawing the canvas")

    for (var c = 0; c < tileColumnCount; c++) {
        for (var r = 0; r < tileRowCount; r++) {
            rect(tiles[c][r].x, tiles[c][r].y, tileW, tileH, tiles[c][r].state)
        }
    }



    window.requestAnimationFrame(draw)
}

function init() {
    canvas = document.getElementById("canvas")
    canvas.height = (tileH + cellSeperation) * (tileRowCount) - cellSeperation
    canvas.width = (tileW + cellSeperation) * (tileColumnCount) - cellSeperation
    ctx = canvas.getContext("2d")
    // return setInterval(draw, 10);
    window.requestAnimationFrame(draw)
}
init()
