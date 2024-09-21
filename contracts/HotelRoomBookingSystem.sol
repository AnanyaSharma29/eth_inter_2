// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract HotelRoomBookingSystem {
    struct Room {
        uint roomId;
        string roomType; // e.g., Single, Double, Suite
        bool isBooked;
    }

    mapping(uint => Room) public rooms;
    mapping(address => mapping(uint => bool)) public bookedRooms;
    uint public roomCount;

    event RoomAdded(uint roomId, string roomType);
    event RoomBooked(address user, uint roomId);
    event RoomVacated(address user, uint roomId);

    function addRoom(string memory roomType) public {
        require(bytes(roomType).length > 0, "Room type cannot be empty");

        roomCount++;
        rooms[roomCount] = Room(roomCount, roomType, false);

        emit RoomAdded(roomCount, roomType);
    }

    function bookRoom(uint roomId) public {
        Room storage room = rooms[roomId];

        // Ensure that the room exists
        require(room.roomId != 0, "Room does not exist");

        // Ensure that the room is not already booked
        require(!room.isBooked, "Room is already booked");

        // Ensure that the user has not already booked this room
        require(!bookedRooms[msg.sender][roomId], "Room already booked by you");

        // Mark the room as booked and record the booking
        room.isBooked = true;
        bookedRooms[msg.sender][roomId] = true;

        emit RoomBooked(msg.sender, roomId);
    }

    function vacateRoom(uint roomId) public {
        Room storage room = rooms[roomId];

        // Ensure that the room exists
        require(room.roomId != 0, "Room does not exist");

        // Ensure that the user has booked this room
        require(bookedRooms[msg.sender][roomId], "Room was not booked by you");

        // Mark the room as available and remove the booking
        room.isBooked = false;
        bookedRooms[msg.sender][roomId] = false;

        emit RoomVacated(msg.sender, roomId);
    }

    function attemptBookRoom(uint roomId) public {
        Room storage room = rooms[roomId];

        // Check if the room exists
        if (room.roomId == 0) {
            revert("Room does not exist");
        }

        // Check if the room is already booked
        if (room.isBooked) {
            revert("Room is already booked");
        }

        // Check if the user has already booked this room
        if (bookedRooms[msg.sender][roomId]) {
            revert("Room already booked by you");
        }

        // Mark the room as booked and record the booking
        room.isBooked = true;
        bookedRooms[msg.sender][roomId] = true;

        emit RoomBooked(msg.sender, roomId);
    }

    function checkRoomAvailability(uint roomId) public view returns (string memory roomType, bool isBooked) {
        Room storage room = rooms[roomId];

        // Ensure that the room exists
        require(room.roomId != 0, "Room does not exist");

        // Return the room details
        return (room.roomType, room.isBooked);
    }

    // Internal function to ensure room state consistency
    function internalCheck(uint roomId) internal view {
        Room storage room = rooms[roomId];
        assert(room.roomId > 0);  // Assert the room ID should always be positive
        assert(room.isBooked == false || room.isBooked == true);  // Assert that isBooked is either true or false
    }
}