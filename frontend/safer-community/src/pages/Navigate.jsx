import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero1.jpg";
import logo from "../assets/logo.png";
import crimeHotspot from "../assets/crimehotspotslogo.svg";
import robot from "../assets/robot.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Loader from "./Loader";
import axios from "axios";
import Footer from "@/components/ui/footer";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; // Optional: import CSS for default styles
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";

import {
  violentCrimeHotspots,
  propertyCrimeHotspots,
  drugWeaponHotspots,
  childRelatedHotspots,
} from "../../../../backend/data.js";

export default function Navigate() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCoordinates = async (area) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${area}, Johannesburg, South Africa`,
            format: "json",
            limit: 1,
          },
        }
      );
      if (response.data.length > 0) {
        return {
          area,
          latitude: response.data[0].lat,
          longitude: response.data[0].lon,
        };
      } else {
        return { area, latitude: null, longitude: null };
      }
    } catch (error) {
      console.error(`Error fetching coordinates for ${area}:`, error);
      return { area, latitude: null, longitude: null };
    }
  };

  const getAllHotspotCoordinates = async (hotspots) => {
    const promises = hotspots.map((area) => getCoordinates(area));
    const results = await Promise.all(promises);
    return results;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView(
              [latitude, longitude],
              13
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapInstance.current);

            L.marker([latitude, longitude])
              .addTo(mapInstance.current)
              .bindPopup("You are here")
              .openPopup();

            const crimeColors = {
              "Violent Crimes": "#f03",
              "Property Related Crimes": "#ff7800",
              "Drug and Weapon Related Crimes": "#800080",
              "Child Related Crime": "#0000ff",
            };
            const crimeTips = {
              "Abduction, Violent Assault, Attempted Murder, Attempted Sexual Offence, Carjacking, Common Assault, Common Robbery, Sexual Offence, Culpable Homicide, Murder, Public Violence, Rape":
                "#f03",
              "Arson, Non-Residential Burglary, Residential Burglary, Malicious damage to property, Non-Residential Robbery, Residential Robbery":
                "#ff7800",
              "DUI, Drug-related crime": "#800080",
              "Kidnapping, Rape, Sexual Assault": "#0000ff",
            };

            const legend = L.control({ position: "bottomleft" });
            legend.onAdd = () => {
              const div = L.DomUtil.create("div", "info legend");
              const categories = Object.keys(crimeColors);
              const tips = Object.keys(crimeTips);
              div.style.backgroundColor = "white";
              div.style.padding = "10px";
              div.style.borderRadius = "5px";

              const style = document.createElement("style");
              style.innerHTML = `
                .info.legend i {
                  width: 15px;
                  height: 15px;
                  float: left;
                  margin-right: 8px;
                  opacity: 0.7;              
                }
              `;
              document.head.appendChild(style);

              for (let i = 0; i < categories.length; i++) {
                const crime = categories[i];
                const tooltip = tips[i];
                const color = crimeColors[crime];

                div.innerHTML += `
                  <i style="background: ${color}" data-tippy-content="${crime} details"></i> 
                  <span data-tippy-content="${tooltip}" style="color: black;">${crime}</span><br>
                `;
              }

              div.appendChild(style);

              tippy(div.querySelectorAll(".info.legend span"), {
                placement: "top",
              });

              return div;
            };

            legend.addTo(mapInstance.current);

            getAllHotspotCoordinates(violentCrimeHotspots).then(
              (coordinates) => {
                coordinates.forEach((location) => {
                  if (location.latitude && location.longitude) {
                    L.circle([location.latitude, location.longitude], {
                      color: "red",
                      fillColor: "#f03",
                      fillOpacity: 0.5,
                      radius: 500,
                    })
                      .addTo(mapInstance.current)
                      .bindPopup("This is a Violent Crime Hotspot");
                  }
                });
              }
            );

            getAllHotspotCoordinates(propertyCrimeHotspots).then(
              (coordinates) => {
                coordinates.forEach((location) => {
                  if (location.latitude && location.longitude) {
                    L.circle([location.latitude, location.longitude], {
                      color: "orange",
                      fillColor: "#ff7800",
                      fillOpacity: 0.5,
                      radius: 500,
                    })
                      .addTo(mapInstance.current)
                      .bindPopup("This is a Property Related Crime Hotspot");
                  }
                });
              }
            );

            getAllHotspotCoordinates(drugWeaponHotspots).then((coordinates) => {
              coordinates.forEach((location) => {
                if (location.latitude && location.longitude) {
                  L.circle([location.latitude, location.longitude], {
                    color: "purple",
                    fillColor: "#800080",
                    fillOpacity: 0.5,
                    radius: 500,
                  })
                    .addTo(mapInstance.current)
                    .bindPopup(
                      "This is a Drug and Weapon Related Crime Hotspot"
                    );
                }
              });
            });

            getAllHotspotCoordinates(childRelatedHotspots).then(
              (coordinates) => {
                coordinates.forEach((location) => {
                  if (location.latitude && location.longitude) {
                    L.circle([location.latitude, location.longitude], {
                      color: "blue",
                      fillColor: "#0000ff",
                      fillOpacity: 0.5,
                      radius: 500,
                    })
                      .addTo(mapInstance.current)
                      .bindPopup("This is a Child Related Crime Hotspot");
                  }
                });
              }
            );

            // Initialize routing control
            L.Routing.control({
              waypoints: [
                L.latLng(latitude, longitude),
                L.latLng(-26.2041, 28.0473), // Example: Johannesburg city center
              ],
              routeWhileDragging: true,
              geocoder: L.Control.Geocoder.nominatim(),
            }).addTo(mapInstance.current);

            setIsLoading(false);
          }
        },
        () => {
          alert("Error in retrieving position.");
          setIsLoading(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-[100dvh] w-screen bg-white">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-10 sm:h-14" />
          </Link>
          <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-900">
            <Link
              to="/chatbot"
              className="text-xl text-black hover:text-[#7D9B76] font-medium hover:underline underline-offset-4"
              prefetch="false"
            >
              Safety AI Chatbot
            </Link>
            <Link
              to="/crimehotspots"
              className="text-xl text-black hover:text-[#7D9B76] font-medium hover:underline underline-offset-4"
              prefetch="false"
            >
              Crime Hotspots
            </Link>

            <h2 className="text-xl text-[#7D9B76] hover:text-[#7D9B76] font-medium hover:underline underline-offset-4">
              Navigate
            </h2>
          </nav>
        </div>
      </header>
      <main>
        {isLoading && <Loader />} {/* Show loader while loading */}
        <div
          ref={mapRef}
          className="map"
          style={{ height: "500px", width: "100%" }}
        ></div>
      </main>
      <Footer />
    </div>
  );
}
