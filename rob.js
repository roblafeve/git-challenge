{
  init: function(elevators, floors) {

    // for each floor that has a button pushed, the first available elevator should go there
    floors.map(function(floor) {
      var buttonPress = 'up_button_pressed' || 'down_button_pressed'
      floor.on(buttonPress, function() {
        elevators.
      })
    })

    elevators.map(function(elevator, i) {
      elevator.on('floor_button_pressed', function(floor) {
        elevator.goToFloor(floor)
      })
    })

  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
