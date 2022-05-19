function addRoomInfo() {
  
}

document.addEventListener("DOMContentLoaded", () => {
  const addRoom = document.querySelector("#add_room");
  addRoom.addEventListener("click", event => {
    event.preventDefault();
    addRoomInfo();
  });
});


<fieldset class="room_size">
  <div class="room_info">
    <label for="bedroom">Enter Dimensions of <span>First</span> Room in Metres or Feet</label>
    <input type="text" name="" id="bedroom" placeholder="ex. 3.8 * 2.9">
  </div>
  <div class="room_info">
    <label for="roommates">How Many People Will Live in This Room?</label>
    <input type="text" name="" id="roommates" placeholder="ex. 1">
  </div>
  <button id="add_room" type="button" name="button">Add Another Room</button>
</fieldset>
