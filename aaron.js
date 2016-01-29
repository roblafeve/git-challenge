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
