{
    init: function(elevators, floors) {
      var requests = {
        up: 0,
        down: 0
      }
      
      floors.map(function(floor){
          floor.on("up_button_pressed", function() {
              console.log ("Up " + floor.level);
          })

          floor.on("down_button_pressed", function() {
              console.log ("Down " + floor.level);
          })
      })


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
