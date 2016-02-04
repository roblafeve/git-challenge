{
    init: function(elevators, floors) {
        // Stage Version
    
        // Print objects we work with into console
        console.log(elevators, floors)

        // Variables Declared
        var FloorQueueUp = [];
        var FloorQueueDown = [];

        // Functions
        // Operations
        function sortNumAsc (a,b) {return a > b ? 1 : a < b ? -1 : 0;}
        function sortNumDsc (a,b) {return a < b ? 1 : a > b ? -1 : 0;}
        function isOdd(num) { return num % 2;}
        function compressArray(original) {
        	var compressed = [];
        	// make a copy of the input array
        	var copy = original.slice(0);

        	// first loop goes over every element
        	for (var i = 0; i < original.length; i++) {

        		var myCount = 0;
        		// loop over every element in the copy and see if it's the same
        		for (var w = 0; w < copy.length; w++) {
        			if (original[i] == copy[w]) {
        				// increase amount of times duplicate is found
        				myCount++;
        				// sets item to undefined
        				delete copy[w];
        			}
        		}

        		if (myCount > 0) {
        			var a = new Object();
        			a.value = original[i];
        			a.count = myCount;
        			compressed.push(a);
        		}
        	}

        	return compressed;
        };

        function FloorVolume (FloorQueueUp, FloorQueueDown) {
            var FloorVolumeUp = compressArray(FloorQueueUp);
            var FloorVolumeDown = compressArray(FloorQueueDown);
            var FloorVolumeCompiled = [
                VolumeUp = FloorVolumeUp,
                VolumeDown = FloorVolumeDown
            ]
            return FloorVolumeCompiled;
        }

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
        }

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
        }

        function FloorController (elevators, floors) {
            // Evaluate all elevators and choose the best options
            elevators.map(function(elevator) {

                if (elevator.rating > elevatorChoice.rating) {
                    elevatorChoice.num = elevators.indexOf(elevator);
                    elevatorChoice.rating = elevator.rating;
                }
            });


        }

        function controller(elevators, floors) {
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
                    if ((floor.floorNum() - elevator.currentFloor() >= 0) && elevatorDirection == "up") {elevatorRating += 50}
                    else if ((floor.floorNum() - elevator.currentFloor() <= 0) && elevatorDirection == "down") {elevatorRating += 50}
                    else if (elevatorDirection == "idle") {elevatorRating += 100}
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

        // On elevator events
        ////////////////////////////////////////////////////////////////////////
        elevators.map(function(elevator) {


            elevator.on("idle", function() {
                controller(elevators, floors)
            })

            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum)
                Sortfloors(elevator)
            })

            elevator.on("passing_floor", function(floorNum, direction) {
                Sortfloors(elevator)
                SetLights(elevator)
            })

            elevator.on("stopped_at_floor", function(floorNum) {
                controller(elevators, floors)
                SetLights (elevator)
            })
        });

        // On floor events
        floors.map(function(floor) {
            floor.on("up_button_pressed", function() {
                FloorQueueUp += floor.floorNum();
                console.log(FloorVolume (FloorQueueUp, FloorQueueDown));
            })
            floor.on("down_button_pressed", function() {
                FloorQueueDown += floor.floorNum();
                console.log(FloorVolume (FloorQueueUp, FloorQueueDown));
            })
        });
        ////////////////////////////////////////////////////////////////////////

    }, /* End of init */

        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        } /* End of update */
}
