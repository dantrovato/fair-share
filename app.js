function addRoomInfo() {
  const id = ID();
  roomsInfo.push({id: id});

  const form = document.querySelector("form");

  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("room_size");
  fieldset.id = "room" + id;
  const bedroomDiv = document.createElement("div");
  const roommatesDiv = document.createElement("div");
  const bedroomLabel = document.createElement("label");
  const roommatesLabel = document.createElement("label");
  const bedroomInput = document.createElement("input");
  const roommatesInput = document.createElement("input");

  bedroomDiv.classList.add("room_info");
  roommatesDiv.classList.add("room_info");
  bedroomLabel.setAttribute("for", "bedroom");
  bedroomLabel.textContent = `Enter Dimensions of Room ${roomsInfo.length} in either square Metres or Feet`;
  bedroomInput.setAttribute("type", "text");
  bedroomInput.setAttribute("class", "bedrooms");
  bedroomInput.setAttribute("placeholder", "ex. 3.8 * 2.9");
  roommatesLabel.setAttribute("for", "roommates");
  roommatesLabel.textContent = "How Many People Will Live in This Room?";
  roommatesInput.setAttribute("type", "text");
  roommatesInput.setAttribute("class", "roommates");
  roommatesInput.setAttribute("placeholder", "ex. 1");
  fieldset.appendChild(bedroomDiv);
  fieldset.appendChild(roommatesDiv);
  bedroomDiv.appendChild(bedroomLabel);
  bedroomDiv.appendChild(bedroomInput);
  roommatesDiv.appendChild(roommatesLabel);
  roommatesDiv.appendChild(roommatesInput);
  form.appendChild(fieldset);
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

  function showButtons() {
    addRoom.classList.remove("hidden");
    addRoom.classList.add("block");
    calculate.classList.remove("hidden");
    main.appendChild(addRoom);
    main.appendChild(calculate);
  }

  function isInvalid(target) {
    if (target.value.match(/[^\d\.]/)) {
      return true;
    } else if (target.value.match(/\./)) {
      if (target.value.match(/\./g).length > 1) {
        return true;
      }
    }

    return false;
  }

  entirePrice.focus();

  entirePrice.addEventListener("blur", event => {
    resetInputError(entirePrice);

    if (!entirePrice.value) {
      handleInputError(entirePrice, "Please enter price for the entire property");
      return;
    }

    if (isInvalid(entirePrice)) {
      handleInputError(entirePrice, "Please only enter a valid number");
      entirePrice.value = "";
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

    if (isInvalid(valueSharedAreas)) {
      handleInputError(valueSharedAreas, "Please only enter a valid number");
      valueSharedAreas.value = "";
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
        if (roomsInfo.length === 1) {
          addRoomInfo();
        }
        showButtons()
      }
    });

    roommates.addEventListener("blur", event => {
      resetInputError(roommates);
      if (!roommates.value) {
        handleInputError(roommates, "Please enter the number of people taking this room");
        return;
      }

      if (bedrooms.value) {
        if (roomsInfo.length === 1) {
          addRoomInfo();
        }
        showButtons();
      }
    });
  });

  addRoom.addEventListener("click", event => {
    event.preventDefault();
    addRoomInfo();
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
