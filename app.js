function addRoomInfo() {
  const form = document.querySelector("form");
  const roomSize = document.querySelector(".room_size");
  const button = document.querySelector("#add_room");
  const calculate = document.querySelector("#calculate");
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("room_size");
  const firstDiv = document.createElement("div");
  const secondDiv = document.createElement("div");
  const firstLabel = document.createElement("label");
  const secondLabel = document.createElement("label");
  const firstInput = document.createElement("input");
  const secondInput = document.createElement("input");

  firstDiv.classList.add("room_info");
  secondDiv.classList.add("room_info");
  firstLabel.setAttribute("for", "bedroom");
  firstLabel.textContent = "Enter Dimensions of Next Largest Room in Metres or Feet";
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

document.addEventListener("DOMContentLoaded", () => {
  let entirePrice = document.querySelector("#price");
  let numberHousemates = document.querySelector("#housemates");
  let valueSharedAreas = document.querySelector("#common");
  let roomSizes = document.getElementsByClassName('bedrooms');
  let roomMates = document.getElementsByClassName("roommates");
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

    if (!entirePrice.value || !numberHousemates.value || !valueSharedAreas.value ||
      !roomSizes.length || !roomMates.length) {
        calculate.value = "Not So Fast";
        // calculate.classList.add("move_away");
        setTimeout(function () {
          calculate.value = "Calculate";
        }, 3000);
        return;
    }

    console.log(entirePrice.value);
    console.log(numberHousemates.value);
    console.log(valueSharedAreas.value);
    let sizesArr = [... roomSizes].map(room => Number(room.value));
    console.log(sizesArr);
    const matesArr = [... roomMates].map(mates => mates.value);
    console.log(matesArr);

    const totalCommon = Number(valueSharedAreas.value) * Number(entirePrice.value) / 100;
    const remainingRent = Number(entirePrice.value) - totalCommon;

    const totalArea = sizesArr.reduce((a, b) => a + b);
    const percentages = sizesArr.map(size => {
      return size * remainingRent / totalArea;
    });

    const rents = percentages.
    map(percentage => Math.round(percentage + totalCommon / Number(numberHousemates.value)));

    commonAreaValue.textContent = `The value of common area is ${Math.round(totalCommon)}`;
    commonAreaValueForEach.textContent = `Each flatmate pays ${Math.round(totalCommon / Number(numberHousemates.value))}`;
    rentForRooms.textContent = `Remaining rent is ${Math.round(remainingRent)}`;
    totals.textContent = `Each room plus share of common area will total to: ${rents.join(" ")}`;
    document.querySelector("footer").classList.remove("hidden");
  });
});
