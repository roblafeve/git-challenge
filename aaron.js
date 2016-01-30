{
    init: function(elevators, floors) {

      // Elevator Input - Send elevator to floor based on rider's input
      elevators.map(function(elevator) {
          // If an elevator button is pressed head to that floor.
          elevator.on('floor_button_pressed', function(floor) {
              elevator.goToFloor(floor);
          })

          // If elevator is idle, assign a floor.
          elevator.on("idle", function() {
            var Bestfloor = floors.length * 3;

            floors.map(function(floor){
              if (floor.buttonStates.up == "activated" || floor.buttonStates.down == "activated") {
                if ( Math.abs(floor.floorNum() - elevator.currentFloor()) < Math.abs(Bestfloor - elevator.currentFloor())) {
                  Bestfloor = floor.floorNum();
                }
              }
            });
            // Go to the closest floor
            if (Bestfloor !== floors.length * 3) {
              floors[Bestfloor].buttonStates.up = "";
              floors[Bestfloor].buttonStates.down = "";
              elevator.goToFloor(Bestfloor);
            };
         });

          // As you pass the floor stop if a button is pressed.
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


              if (elevator.destinationDirection() == "up" && floors[floorNum].buttonStates.up == "activated" ) {
                elevator.goingUpIndicator(true);
                elevator.goToFloor(floorNum, true);
                floors[floorNum].buttonStates.up = "";
              }
              if (elevator.destinationDirection() == "down" && floors[floorNum].buttonStates.down == "activated" ) {
                elevator.goingDownIndicator(true);
                elevator.goToFloor(floorNum, true);
                floors[floorNum].buttonStates.down = "";
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
