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

        // Send elevator to floor based on rider's input
        elevators.map(function(elevator) {
                elevator.on('floor_button_pressed', function(floor) {
                    elevator.goToFloor(floor)
                })
                elevator.on("idle", function() { elevator.goToFloor(0); });
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
