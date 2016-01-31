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
            // Evaluate state of floors and elevators
            // Evaluate every elevator against each floor
            floors.map(function(floor) {

                // Declare variables
                var elevatorNum = 0;
                var elevatorRating = 0;
                var elevatorDirection = "";
                var floorDirection = "";

                elevators.map(function(elevator) {
                    elevatorNum = elevators.indexOf(elevator);
                    elevatorRating = 0;
                    // Adjust rating based on distance between elevator and current floor
                    elevatorRating += floors.length / (Math.abs(floor.floorNum() - elevator.currentFloor()));
                    // Adjust rating based on available space in elevator
                    elevatorRating += elevator.maxPassengerCount() * elevator.loadFactor();
                    // DEBUG... should this logic be moved to the start along with logic to confirm floor actually needs an elevator? Answer probably yes. Since if a floor has been hit in an elevator it is going to that floor.
                    // Elevator rating + 100 if the floor has already been pressed
                    elevator.getPressedFloors().map(function(buttonPress) {
                        if (floor.floorNum() == buttonPress) {
                            elevatorRating += 100
                        }
                    });

                    // Compute elevator direction
                    if ((elevator.destinationQueue[0] - elevator.currentFloor() > 0) || elevator.destinationDirection() == "up") {elevatorDirection = "up"}
                    else if ((elevator.destinationQueue[0] - elevator.currentFloor() < 0) || elevator.destinationDirection() == "down") {elevatorDirection = "down"}
                    else {elevatorDirection = "idle"}

                    // Adjust rating if headed in the right direction positively... otherwise negatively adjust it.
                    if ((floor.floorNum() - elevator.currentFloor() >= 0) && elevatorDirection == "up") {elevatorRating += floors.length - (Math.abs(floor.floorNum() - elevator.currentFloor()))}
                    else if ((floor.floorNum() - elevator.currentFloor() <= 0) && elevatorDirection == "down") {elevatorRating += floors.length - (Math.abs(floor.floorNum() - elevator.currentFloor()))}
                    else {elevatorRating -= floors.length}

                    // Possibly... change this based off max space and buttons pressed
                    // Lower elevator rating if there is no room in the elevator
                    if (elevator.loadFactor() == 0) {
                        elevatorRating -= floors.length;
                    }

                });

                floor.elevatorNum = 0;
            });

            elevators.map(function(elevator) {

            });

            // Change state of elevators


        };
    },

    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }

}
