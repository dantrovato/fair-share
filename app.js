function addRoomInfo() {
  const id = ID();
  roomsInfo.push({id: id});

  const initialAddRoom = document.querySelector("#initial_add_room").classList.add("hidden");
  const form = document.querySelector("form");
  const roomSize = document.querySelector(".room_size");
  const button = document.querySelector("#add_room");
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
  firstLabel.textContent = `Enter Dimensions of Room ${id} in Metres or Feet`;
  firstInput.setAttribute("type", "text");
  firstInput.setAttribute("id", "bedrooms");
  firstInput.setAttribute("class", "bedrooms");
  firstInput.setAttribute("placeholder", "ex. 3.8 * 2.9");
  secondLabel.setAttribute("for", "roommates");
  secondLabel.textContent = "How Many People Will Live in This Room?";
  secondInput.setAttribute("type", "text");
  secondInput.setAttribute("id", "roommates");
  secondInput.setAttribute("class", "roommates");
  secondInput.setAttribute("placeholder", "ex. 1");
  button.setAttribute("id", "add_room");

  fieldset.appendChild(firstDiv);
  fieldset.appendChild(secondDiv);
  firstDiv.appendChild(firstLabel);
  firstDiv.appendChild(firstInput);
  secondDiv.appendChild(secondLabel);
  secondDiv.appendChild(secondInput);
  fieldset.appendChild(button);
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

function removeIncompleteRooms(rooms) { // ========================================================================
  // remove from page and from object:

  // get ids of rooms that are incomplete
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

const ID = generateId();
const roomsInfo = [];

document.addEventListener("DOMContentLoaded", () => {
  const addRoom = document.querySelector("#add_room");

  addRoom.addEventListener("click", event => {
    event.preventDefault();
    addRoomInfo();
  });

  const calculate = document.querySelector("#calculate");
  const commonAreaValue = document.querySelector("#common_area_value");
  const commonAreaValueForEach = document.querySelector("#common_area_value_for_each");
  const rentForRooms = document.querySelector("#rent_for_rooms");
  const totals = document.querySelector("#totals");

  calculate.addEventListener("click", event => {
    event.preventDefault();
    const entirePrice = document.querySelector("#price");
    const valueSharedAreas = document.querySelector("#common");
    const roomSizes = document.getElementsByClassName('bedrooms');
    const roomMates = document.getElementsByClassName("roommates");

    // if (!entirePrice.value || !valueSharedAreas.value ||
    //   !roomSizes.length || !roomMates.length
    //   ) {
    //   calculate.value = "Not So Fast";
    //   // calculate.classList.add("move_away");
    //   setTimeout(function () {
    //     calculate.value = "Calculate";
    //   }, 1000);
    //   return;
    // }

    let sizesArr = [... roomSizes].map(room => Number(room.value));
    const matesArr = [... roomMates].map(mates => mates.value);
    const totalCommon = Number(valueSharedAreas.value) * Number(entirePrice.value) / 100;
    const remainingRent = Number(entirePrice.value) - totalCommon;

    const totalArea = sizesArr.reduce((a, b) => a + b, 0);
    const percentages = sizesArr.map(size => {

      return size * remainingRent / totalArea;
    });

    document.querySelector("footer").classList.remove("hidden");

    roomsInfo.forEach((room, idx) => {
      let numRoommates = Number(document.querySelector("#room" + room.id).firstElementChild.nextSibling.firstChild.nextElementSibling.value);
      room.roommates = numRoommates;
      room.dimentions = Number(document.querySelector("#room" + room.id).firstElementChild.firstChild.nextElementSibling.value);
      room.roomPrice = percentages[idx] / room.roommates;
      room.totalPrice = (percentages[idx] / room.roommates) + (totalCommon / countHousemates(roomsInfo));
    });

    removeIncompleteRooms(roomsInfo);

    let html = "";
    roomsInfo.forEach((room, i) => {

      html += `<p>Room ${room.id} has ${room.roommates} occupant paying a total rent of ${Math.round(room.roomPrice + totalCommon / countHousemates(roomsInfo))} each</p>`;
    });

    totals.innerHTML = html;

    commonAreaValue.textContent = `The value of common area is ${Math.round(totalCommon)}`;
    commonAreaValueForEach.textContent = `Each of the ${countHousemates(roomsInfo)} flatmates pays ${Math.round(totalCommon / countHousemates(roomsInfo))} for an equal share of the common areas.`;
    rentForRooms.textContent = `Remaining rent is ${Math.round(remainingRent)}. This is divided by the ${countHousemates(roomsInfo)} housemates according to how many people share the same room.`;
    // totals.textContent = `Each room plus share of common area will total to: ${rents.join(" ")}`;

    // console.log(countHousemates(roomsInfo));
    // console.log(getNumOfRooms(roomsInfo));
  });
});

// take id of room and take note of how many people that room will have. then each roommate adds share of common area
