{
    init: function(elevators, floors) {
        // Print objects we work with into console
        console.log(elevators, floors)

        // Variables Declared
        var FloorQueueUp = [];
        var FloorQueueDown = [];

        // Functions
        // Operations
        function sortNumAsc (a,b) {return a > b ? 1 : a < b ? -1 : 0;}
        function sortNumDsc (a,b) {return a < b ? 1 : a > b ? -1 : 0;}

        function Sortfloors(elevator) {
            var reverse = false
            elevator.destinationQueue.sort(sortNumAsc)
            elevator.checkDestinationQueue();

            if (elevator.destinationDirection == "down") {reverse = true}
            if (elevator.destinationQueue[0] - elevator.currentFloor() < 0) {reverse = true}

            if (reverse == true) {
                elevator.destinationQueue.sort(sortNumDsc)
                elevator.checkDestinationQueue();
            }
        } /* End Sortfloors */

        function SetLights (elevator) {
            if (elevator.destinationQueue[0] > elevator.currentFloor()) {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(false);
            }
            else if (elevator.destinationQueue[0] < elevator.currentFloor()) {
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
            else {
                elevator.goingUpIndicator(true);
                elevator.goingDownIndicator(true);
            }
        } /* End SetLights */

        function AddPressedFloors (elevator) {
            elevator.destinationQueue = [];
            elevator.destinationQueue = elevator.getPressedFloors();
            elevator.checkDestinationQueue();
        }

        function controller(elevators, floors) {
            elevators.map(function(elevator) {
                AddPressedFloors (elevator)

                if (elevator.goingUpIndicator() && floors[elevator.currentFloor()].buttonStates.up == "activated") {
                    elevator.goToFloor(elevator.currentFloor(), true);
                }

                if (elevator.goingDownIndicator() && floors[elevator.currentFloor()].buttonStates.down == "activated") {
                    elevator.goToFloor(elevator.currentFloor(), true);
                }


                /*
                if (elevator.goingUpIndicator() && floors[floorNum].buttonStates.up == "activated" && elevator.loadFactor() < 0.3 ) {
                    elevator.goToFloor(floorNum, true);
                    floors[floorNum].buttonStates.up = "";
                }
                if (elevator.goingDownIndicator() && floors[floorNum].buttonStates.down == "activated" && elevator.loadFactor() < 0.3) {
                    elevator.goToFloor(floorNum, true);
                    floors[floorNum].buttonStates.down = "";
                }
                */

                Sortfloors(elevator)
                SetLights(elevator)
            });
        } /* End controller */

        // On elevator events
        ////////////////////////////////////////////////////////////////////////
        elevators.map(function(elevator) {
            elevator.on("idle", function() {
                controller(elevators, floors)
            })

            elevator.on("floor_button_pressed", function(floorNum) {
                controller(elevators, floors)
            })

            elevator.on("passing_floor", function(floorNum, direction) {
                controller(elevators, floors)

            })

            elevator.on("stopped_at_floor", function(floorNum) {
                controller(elevators, floors)
            })
        });

        // On floor events
        floors.map(function(floor) {
            floor.on("up_button_pressed", function() {
                controller(elevators, floors)
            })
            floor.on("down_button_pressed", function() {
                controller(elevators, floors)
            })
        });
        ////////////////////////////////////////////////////////////////////////

    }, /* End of init */

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        } /* End of update */
}
