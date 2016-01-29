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
