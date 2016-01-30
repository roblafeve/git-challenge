{
    init: function(elevators, floors) {



      //**********************************************************************
      //**********************************************************************
      // MAP Elevators
      elevators.map(function(elevator) {


        //**********************************************************************
        // Idle Elevator - Assign a floor. Current Logic: Find closest floor
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
        // Idle Elevator
        //**********************************************************************


        //**********************************************************************
        // Floor pressed in elevator - Assign floor. Queue to end of elevator
          elevator.on('floor_button_pressed', function(floor) {
            elevator.goToFloor(floor);
        });
        //**********************************************************************


        //**********************************************************************
        // Indicator lights

        // Indicator lights
        //**********************************************************************


        //**********************************************************************
        // Floor Button Pressed - Queue floor if in right directio
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
        // Floor Button Pressed
        //**********************************************************************


    });
    // End Elevator Input
    //**********************************************************************
    //**********************************************************************



    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
