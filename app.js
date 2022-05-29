function addRoomInfo() {
  const id = ID();
  roomsInfo.push({id: id});

  // const initialAddRoom = document.querySelector("#initial_add_room").classList.add("hidden");
  const form = document.querySelector("form");
  const roomSize = document.querySelector(".room_size");
  // const button = document.querySelector("#add_room");
  const calculate = document.querySelector("#calculate");
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("room_size");
  fieldset.id = "room" + id;
  const firstDiv = document.createElement("div");
  const secondDiv = document.createElement("div");
  const firstLabel = document.createElement("label");
  const secondLabel = document.createElement("label");
  const firstInput = document.createElement("input");
  const secondInput = document.createElement("input");

  firstDiv.classList.add("room_info");
  secondDiv.classList.add("room_info");
  firstLabel.setAttribute("for", "bedroom");
  firstLabel.textContent = `Enter Dimensions of Room ${roomsInfo.length} in Metres or Feet`;
  firstInput.setAttribute("type", "text");
  // firstInput.setAttribute("id", "bedrooms");
  firstInput.setAttribute("class", "bedrooms");
  firstInput.setAttribute("placeholder", "ex. 3.8 * 2.9");
  secondLabel.setAttribute("for", "roommates");
  secondLabel.textContent = "How Many People Will Live in This Room?";
  secondInput.setAttribute("type", "text");
  // secondInput.setAttribute("id", "roommates");
  secondInput.setAttribute("class", "roommates");
  secondInput.setAttribute("placeholder", "ex. 1");
  // button.setAttribute("id", "add_room");

  fieldset.appendChild(firstDiv);
  fieldset.appendChild(secondDiv);
  firstDiv.appendChild(firstLabel);
  firstDiv.appendChild(firstInput);
  secondDiv.appendChild(secondLabel);
  secondDiv.appendChild(secondInput);
  // fieldset.appendChild(button);
  form.appendChild(fieldset);
  form.appendChild(calculate);
}

function generateId() {
  let id = 0;
  return function() {
    id += 1;
    return id;
  }
}

function countHousemates(rooms) {
  let total = 0;
  rooms.forEach(room => {
    total += room.roommates;
  });
  return total;
};

function getNumOfRooms(rooms) {
  return rooms.map(room => room.id).sort().reverse()[0];
}

function removeIncompleteRooms(rooms) {
  const incompleteRoomsID = rooms.filter(room => room.roommates === 0 || room.dimentions === 0).map(room => room.id);
  incompleteRoomsID.forEach(id => {
    let room = document.querySelector(`#room${id}`);
    room.remove();
  });

  const completeRooms = rooms.filter(room => room.roommates !== 0 && room.dimentions !== 0);
  rooms.length = 0;
  completeRooms.forEach(room => {
    rooms.push(room);
  });
}

function removeErrorSettings(tooltip, target) {
  tooltip.classList.add("hidden");
  target.style.backgroundColor = null;
}

const ID = generateId();
const roomsInfo = [];

document.addEventListener("DOMContentLoaded", () => {
  const calculate = document.querySelector("#calculate");
  const addRoom = document.querySelector("#add_room");
  const main = document.querySelector("main");
  const entirePrice = document.querySelector("#price");
  let commonField = document.querySelector("#common_fieldset");
  const valueSharedAreas = document.querySelector("#common");
  const tooltip = document.querySelector(".tooltip");

  function handleInputError(target, message) {
    tooltip.classList.remove("hidden");
    tooltip.textContent = message;
    target.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    target.focus();
  }

  function resetInputError(target) {
    tooltip.classList.add("hidden");
    target.style.backgroundColor = null;
  }

  entirePrice.focus();

  entirePrice.addEventListener("blur", event => {
    resetInputError(entirePrice);
    if (!entirePrice.value) {
      handleInputError(entirePrice, "Please enter price for the entire property");
      return;
    }
    commonField.classList.remove("hidden");
    valueSharedAreas.focus();
    return;
  });

  valueSharedAreas.addEventListener("blur", event => {
    resetInputError(valueSharedAreas);
    if (!valueSharedAreas.value) {
      handleInputError(valueSharedAreas, "Please enter estimated value of common areas");
      return;
    }

    addRoomInfo();

    const bedrooms = document.querySelector(".bedrooms");
    bedrooms.focus();
    const roommates = document.querySelector(".roommates");

    bedrooms.addEventListener("blur", event => {
      resetInputError(bedrooms);
      if (!bedrooms.value) {
        handleInputError(bedrooms, "Please enter the room dimentions");
        return;
      }

      if (roommates.value) {
        addRoom.classList.remove("hidden");
        calculate.classList.remove("hidden");
        addRoomInfo();
        main.appendChild(addRoom);
      }
    });

    roommates.addEventListener("blur", event => {
      resetInputError(roommates);
      if (!roommates.value) {
        handleInputError(roommates, "Please enter the number of people taking this room"  );
        return;
      }

      if (bedrooms.value) {
        addRoom.classList.remove("hidden");
        calculate.classList.remove("hidden");
        addRoomInfo();
        main.appendChild(addRoom);
      }
    });
  });



  addRoom.addEventListener("click", event => {
    event.preventDefault();
    addRoomInfo();
    // main.appendChild(addRoom);
    main.appendChild(calculate);
  });

  const commonAreaValue = document.querySelector("#common_area_value");
  const commonAreaValueForEach = document.querySelector("#common_area_value_for_each");
  const rentForRooms = document.querySelector("#rent_for_rooms");
  const totals = document.querySelector("#totals");
  const roomSizes = document.getElementsByClassName('bedrooms');
  const roomMates = document.getElementsByClassName("roommates");

  calculate.addEventListener("click", event => {
    event.preventDefault();

    // const roomSizes = document.getElementsByClassName('bedrooms');
    // const roomMates = document.getElementsByClassName("roommates");

    if (!entirePrice.value || !valueSharedAreas.value ||
      !roomSizes.length || !roomMates.length
      ) {
      calculate.value = "Not So Fast";
      // calculate.classList.add("move_away");
      setTimeout(function () {
        calculate.value = "Calculate";
      }, 1000);
      return;
    }

    let sizesArr = [... roomSizes].map(room => Number(room.value));
    const matesArr = [... roomMates].map(mates => mates.value);
    const totalCommon = Number(valueSharedAreas.value) * Number(entirePrice.value) / 100;
    const remainingRent = Number(entirePrice.value) - totalCommon;

    const totalArea = sizesArr.reduce((a, b) => a + b, 0);
    const percentages = sizesArr.map(size => {

      return size * remainingRent / totalArea;
    });

    roomsInfo.forEach((room, idx) => {
      let numRoommates = Number(document.querySelector("#room" + room.id).firstElementChild.nextSibling.firstChild.nextElementSibling.value);
      room.roommates = numRoommates;
      room.dimentions = Number(document.querySelector("#room" + room.id).firstElementChild.firstChild.nextElementSibling.value);
      room.roomPrice = percentages[idx] / room.roommates;
      room.totalPrice = (percentages[idx] / room.roommates) + (totalCommon / countHousemates(roomsInfo));
    });

    removeIncompleteRooms(roomsInfo);

    if (!roomsInfo.length) {
      return;
    }

    document.querySelector("footer").classList.remove("hidden");

    let html = "";
    roomsInfo.forEach((room, idx) => {

      html += `<p>Room ${idx + 1} has ${room.roommates} occupant paying a total rent of ${Math.round(room.roomPrice + totalCommon / countHousemates(roomsInfo))} each</p>`;
    });

    totals.innerHTML = html;

    commonAreaValue.textContent = `The value of common area is ${Math.round(totalCommon)}`;
    commonAreaValueForEach.textContent = `Each of the ${countHousemates(roomsInfo)} flatmates pays ${Math.round(totalCommon / countHousemates(roomsInfo))} for an equal share of the common areas.`;
    rentForRooms.textContent = `Remaining rent is ${Math.round(remainingRent)}. This is divided by the ${countHousemates(roomsInfo)} housemates according to the size of the rooms and number of people occupying them.`;
  });
});
