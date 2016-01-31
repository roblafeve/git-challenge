{
    init: function(elevators, floors) {
        // Print objects we work with into console
        console.log(elevators, floors);

        // On elevator events call controller
        elevators.map(function(elevator) {
            elevator.on("idle", function() {controller();});
            elevator.on("floor_button_pressed", function(floorNum) {controller();});
            elevator.on("passing_floor", function(floorNum, direction) {controller();});
            elevator.on("stopped_at_floor", function(floorNum) {controller();});
        });

        // On floor events call controller
        floors.map(function(floor) {
            floor.on("up_button_pressed", function() {controller();});
            floor.on("down_button_pressed", function() {controller();});
        });

        // Decide how to react to state of elevators and floors with controller
        function controller() {
            // Declare variables
            var elevatorNum = 0;
            var elevatorRating = 0;
            var elevatorDirection = "";
            var floorDirection = "";

            // Evaluate state of floors and elevators
            // Evaluate every elevator against each floor
            floors.map(function(floor) {
                elevators.map(function(elevator) {
                    elevatorNum = elevators.indexOf(elevator);
                    elevatorRating = 0;

                    // Compute elevator direction
                    if ((elevator.destinationQueue[0] - elevator.currentFloor() > 0) || elevator.destinationDirection() == "up") {elevatorDirection = "up"}
                    else if ((elevator.destinationQueue[0] - elevator.currentFloor() < 0) || elevator.destinationDirection() == "down") {elevatorDirection = "down"}
                    else {elevatorDirection = "idle"}

                    // Adjust rating based on distance between elevator and current floor
                    elevatorRating += floors.length / (Math.abs(floor.floorNum() - elevator.currentFloor()));
                    // Adjust rating based on available space in elevator
                    elevatorRating += elevator.maxPassengerCount() * elevator.loadFactor();
                    // Elevator rating + 100 if the floor has already been pressed
                    elevator.getPressedFloors().map(function(buttonPress) {
                        if (floor.floorNum() == buttonPress) {
                            elevatorRating += 100
                        }
                    });

                    // Adjust rating if headed in the right direction positively... otherwise negatively adjust it.
                    if ((floor.floorNum() - elevator.currentFloor() >= 0) && elevatorDirection == "up") {elevatorRating += floors.length - (Math.abs(floor.floorNum() - elevator.currentFloor()))}
                    else if ((floor.floorNum() - elevator.currentFloor() <= 0) && elevatorDirection == "down") {elevatorRating += floors.length - (Math.abs(floor.floorNum() - elevator.currentFloor()))}
                    else {elevatorRating -= floors.length}

                    // Lower elevator rating if there is no room in the elevator
                    if (elevator.loadFactor() == 0) {
                        elevatorRating -= Math.abs(floors.length - elevator.getPressedFloors());
                    }

                    // Assign computed values to elevator
                    elevator.rating = elevatorRating;
                    elevator.direction = elevatorDirection;
                });

                var elevatorChoice = {
                    num: 0,
                    rating: 0
                }
                // Evaluate all elevators and choose the best options
                elevators.map(function(elevator) {
                    if (elevator.rating > elevatorChoice.rating) {
                        elevatorChoice.num = elevators.indexOf(elevator);
                        elevatorChoice.rating = elevator.rating;
                    }
                });

                // Queue Floor
                if (floor.buttonStates.up == "activated" || floor.buttonStates.down == "activated") {
                    elevators[elevatorChoice.num].goToFloor(floor.floorNum());
                }
                elevators[elevatorChoice.num].getPressedFloors().map(function(buttonPress) {
                    if (floor.floorNum() == buttonPress) {
                        elevators[elevatorChoice.num].goToFloor(floor.floorNum());
                    }
                });

            });

            elevators.map(function(elevator) {
                if (elevator.direction == "up") {
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                }
                if (elevator.direction == "down") {
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                }
            });

            // Change state of elevators


        };
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }

}
