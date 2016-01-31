{
    init: function(elevators, floors) {
      // currently for use in determining what properties to use
      console.log(elevators);
      console.log(floors);
    },
    update: function(dt, elevators, floors) {

    }
}




{
    init: function(elevators, floors) {
        var elevator = elevators[0]; // Let's use the first elevator

        // Whenever the elevator is idle (has no more queued destinations) ...
        elevator.on("idle", function() {
            // let's go to all the floors (or did we forget one?)
            elevator.goToFloor(0);
            elevator.goToFloor(1);
        });
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}


{
    init: function(elevators, floors) {

      // Send elevator to floor based on waiter's input
      floors.map(function(floor){
          floor.on("up_button_pressed", function() {
              console.log ("Up " + floor.level);
          })

          floor.on("down_button_pressed", function() {
              console.log ("Down " + floor.level);
          })
      })

      // Elevator Input - Send elevator to floor based on rider's input
              elevators.map(function(elevator) {
                  elevator.on('floor_button_pressed', function(floor) {
                      elevator.goToFloor(floor)
                  })
                  elevator.on("idle", function() {elevator.goToFloor(0); });
                  elevator.on("passing_floor", function(floorNum, direction) {
                  });
              })
              // End Elevator Input

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}


{
    init: function(elevators, floors) {

      // Elevator Input - Send elevator to floor based on rider's input
      elevators.map(function(elevator) {
          elevator.on('floor_button_pressed', function(floor) {
              elevator.goToFloor(floor)
          })
          elevator.on("idle", function() {elevator.goToFloor(0); });
          elevator.on("passing_floor", function(floorNum, direction) {
              if (elevator.destinationDirection() == "up" && floors[floorNum].buttonStates.up == "activated" ) {
                elevator.goingUpIndicator(true);
                elevator.goToFloor(floorNum, true)
                floors[floorNum].buttonStates.up = ""
              }
              if (elevator.destinationDirection() == "down" && floors[floorNum].buttonStates.down == "activated" ) {
                elevator.goingDownIndicator(true);
                elevator.goToFloor(floorNum, true)
                floors[floorNum].buttonStates.down = ""
              }
              // console.log(floors[floorNum].buttonStates);
          });
      })
      // End Elevator Input

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}


// Works but causes the thing to crash
{
    init: function(elevators, floors) {

      // Elevator Input - Send elevator to floor based on rider's input
      elevators.map(function(elevator) {
        // If an elevator button is pressed head to that floor.
          elevator.on('floor_button_pressed', function(floor) {
              elevator.destinationQueue += floor
              elevator.destinationQueue.sort;
              elevator.checkDestinationQueue();
          })

          elevator.on("idle", function() {elevator.goToFloor(0); });

          // As you pass the floor stop if a button is pressed.
          elevator.on("passing_floor", function(floorNum, direction) {
              if (elevator.destinationDirection() == "up" && floors[floorNum].buttonStates.up == "activated" ) {
                elevator.goingUpIndicator(true);
                elevator.goToFloor(floorNum, true)
                floors[floorNum].buttonStates.up = ""
              }
              if (elevator.destinationDirection() == "down" && floors[floorNum].buttonStates.down == "activated" ) {
                elevator.goingDownIndicator(true);
                elevator.goToFloor(floorNum, true)
                floors[floorNum].buttonStates.down = ""
              }
              // console.log(floors[floorNum].buttonStates);
          });
      })
      // End Elevator Input

    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}


elevator.on("stopped_at_floor", function(floorNum) {
  elevator.destinationQueue.map(function(floor) {
    if (floor > floorNum) {
      elevator.goingUpIndicator(true);
    }
    else if (floor < floorNum) {
      elevator.goingDownIndicator(true);
    }
    else if (floorNum = 0 ) {
      elevator.goingUpIndicator(true);
    }
  });
});


////////////////////////////////////////////////////////////////////////////////

{
    init: function(elevators, floors) {



      //**********************************************************************
      // MAP Elevators
      //**********************************************************************
      elevators.map(function(elevator) {


        // Idle Elevator - Assign a floor. Current Logic: Find closest floor
        //**********************************************************************
        elevator.on("idle", function() {
            var Bestfloor = floors.length * 3
            floors.map(function(floor){
                if (floor.buttonStates.up == "activated" || floor.buttonStates.down == "activated") {
                    if ( Math.abs(floor.floorNum() - elevator.currentFloor()) < Math.abs(Bestfloor - elevator.currentFloor())) {
                        Bestfloor = floor.floorNum();
                    }
                }
            });

            if (Bestfloor !== floors.length * 3 && elevator.loadFactor() < 0.3) {
                floors[Bestfloor].buttonStates.up = "";
                floors[Bestfloor].buttonStates.down = "";
                elevator.goToFloor(Bestfloor);
            }
            else {
              elevator.goToFloor(0);
            };
        });
        //**********************************************************************


        // Floor pressed in elevator - Assign floor. Queue to end of elevator
        //**********************************************************************
          elevator.on('floor_button_pressed', function(floor) {
            elevator.goToFloor(floor);
        });
        //**********************************************************************


        // Floor Button Pressed - Queue floor if in right directio
        //**********************************************************************
        elevator.on("passing_floor", function(floorNum, direction) {

            if (elevator.destinationDirection() == "up") {
                elevator.destinationQueue.sort();
                elevator.checkDestinationQueue();
            }
            if (elevator.destinationDirection() == "down") {
                elevator.destinationQueue.sort();
                elevator.destinationQueue.reverse();
                elevator.checkDestinationQueue();
            }


            if (elevator.destinationDirection() == "up" && floors[floorNum].buttonStates.up == "activated" && elevator.loadFactor() < 0.3 ) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
                elevator.goToFloor(floorNum, true);
                floors[floorNum].buttonStates.up = "";
            }
            if (elevator.destinationDirection() == "down" && floors[floorNum].buttonStates.down == "activated" && elevator.loadFactor() < 0.3) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
                elevator.goToFloor(floorNum, true);
                floors[floorNum].buttonStates.down = "";
            }
        });
        //**********************************************************************

        // Update Indicator lights
        //**********************************************************************
          elevator.on("passing_floor", function(floorNum, direction) {
            var nextstop = elevator.destinationQueue[0]
            if (nextstop > floorNum) {
              elevator.goingUpIndicator(true);
              elevator.goingDownIndicator(false);
            } else {
              elevator.goingUpIndicator(false);
              elevator.goingDownIndicator(true);
            }
          });

          elevator.on("stopped_at_floor", function (floorNum) {
            var nextstop = elevator.destinationQueue[0]
            if (nextstop > floorNum) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
            else if (nextstop < floorNum) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
            else {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(true);
            }
          });

          elevator.on("idle", function() {
            elevator.goingUpIndicator(true);
              if(elevator.currentFloor() !== 0) {elevator.goingDownIndicator(true);}
          });
        //**********************************************************************

    });
    //**********************************************************************
    //**********************************************************************



    },
        //**********************************************************************
        // Update Function
        //**********************************************************************
        update: function(dt, elevators, floors) {

        }
        //**********************************************************************
        //**********************************************************************
}

// Declare variables
var FloorAssignment = {
    floor: 0,
    buttonStates: {
        down: "",
        up: ""
    },
    elevatorNum: 0,
    elevatorRating: 0
};
