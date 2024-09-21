const socket = io();

// Check if the browser supports geolocation
if (navigator.geolocation) {
  // Watch the position of the client
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Sending location:", { latitude, longitude });
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Error fetching location:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.error("Geolocation is not supported by this browser.");
}

// Initialize the map at some default position
const map = L.map("map").setView([0, 0], 16);

// For visual map representation
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "OpenStreetMap",
}).addTo(map);

// Creating an empty object to store markers
const markers = {};

// Listen for the location updates from the server
socket.on("receive-location", (data) => {
  console.log("Received location data:", data);

  const { id, latitude, longitude } = data;

  // Set the view to the new location
  map.setView([latitude, longitude]);

  // If a marker already exists for this id, update its position
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Otherwise, create a new marker
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    console.log('Disconnected');
    
    delete markers[id];
  }
});
/////

// if tou want custom icons(different colors) use following code 

// const socket = io();

// // Check if the browser supports geolocation
// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;
//       console.log("Sending location:", { latitude, longitude });
//       socket.emit("send-location", { latitude, longitude });
//     },
//     (error) => {
//       console.error("Error fetching location:", error);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// } else {
//   console.error("Geolocation is not supported by this browser.");
// }

// const map = L.map("map").setView([0, 0], 10);
// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//   attribution: "OpenStreetMap",
// }).addTo(map);

// const markers = {};

// // Define custom icons
// const createCustomIcon = (color, size) => {
//   return L.icon({
//     iconUrl: `https://via.placeholder.com/${size}/${color}`, // Use a placeholder for demo; replace with actual icons if needed
//     iconSize: [size, size], // Size of the icon
//     iconAnchor: [size / 2, size], // Anchor point of the icon
//   });
// };

// socket.on("receive-location", (data) => {
//   console.log("Received location data:", data);
//   const { id, latitude, longitude } = data;

//   // Generate random colors and sizes for demo purposes
//   const color = Math.floor(Math.random()*16777215).toString(16); // Random color
//   const size = Math.floor(Math.random() * 30) + 20; // Random size between 20 and 50

//   const customIcon = createCustomIcon(color, size);

//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//   } else {
//     markers[id] = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
//   }
// });

// socket.on("user-disconnected", (id) => {
//   if (markers[id]) {
//     map.removeLayer(markers[id]);
//     delete markers[id];
//   }
// });
