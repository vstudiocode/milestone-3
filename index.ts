import express from "express";
import ejs from "ejs";
import { Car } from "./interfaces/cars"

const app = express();

let vehicles: any;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("port", 3000);

app.get("/", (req, res) => {
    let filteredVehicles: Car[] = [...vehicles];

    if (req.query["q"] !== undefined) {
        const queryString = req.query["q"].toString().toLowerCase();
        filteredVehicles = filteredVehicles.filter(vehicle => vehicle.name.toLowerCase().includes(queryString));
    }

    if (req.query["s"] !== undefined) {
        const sortParam = req.query["s"].toString().toLowerCase();
        switch (sortParam) {
            case 'nameasc':
                filteredVehicles.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'namedesc':
                filteredVehicles.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'classasc':
                filteredVehicles.sort((a, b) => a.class.localeCompare(b.class));
                break;
            case 'classdesc':
                filteredVehicles.sort((a, b) => b.class.localeCompare(a.class));
                break;
            case 'playstyleasc':
                filteredVehicles.sort((a, b) => a.playstyle[0].localeCompare(b.playstyle[0]));
                break;
            case 'playstyledesc':
                filteredVehicles.sort((a, b) => b.playstyle[0].localeCompare(a.playstyle[0]));
                break;
            case 'playstylesasc':
                filteredVehicles.sort((a, b) => a.playstyle[1].localeCompare(b.playstyle[1]));
                break;
            case 'playstylesdesc':
                filteredVehicles.sort((a, b) => b.playstyle[1].localeCompare(a.playstyle[1]));
                break;
        }
    }

    res.render("index.ejs", { vehicles: filteredVehicles });
});

app.get("/car/:name", (req, res) => {

    let name: string = req.params.name;

    let nameCar: string = "";
    let type: string = "";
    let image: string = "";
    let carClass: string = "";
    let rarity: string = "";
    let playstyle1: string = "";
    let playstyle2: string = "";

    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        let vehicleName: string = vehicle.name;

        if (vehicleName === name) {
            nameCar = vehicle.name;
            type = vehicle.type;
            image = vehicle.image;
            carClass = vehicle.class;
            playstyle1 = vehicle.playstyle[0];
            playstyle2 = vehicle.playstyle[1];
            break;
        }
    }

    res.render("car.ejs", { nameCar: nameCar, type: type, image: image, carClass: carClass, rarity: rarity, playstyle1: playstyle1, playstyle2: playstyle2 });
});

type ClassName = string;

app.get("/classes", (req, res) => {

    let uniqueClasses: ClassName[] = [];
    let filteredVehicles: Car[] = [...vehicles];

    filteredVehicles.forEach(vehicle => {

        const className = vehicle.class.charAt(0).toUpperCase() + vehicle.class.slice(1);

        if (!uniqueClasses.includes(className)) {

            uniqueClasses.push(className);
        }
    });

    uniqueClasses = uniqueClasses.sort();

    res.render("classes.ejs", { classes: uniqueClasses });
});

app.get("/class/:name", (req, res) => {

    let name: string = req.params.name.toLowerCase();

    let filteredVehicles: Car[] = [...vehicles];
    let showVehciles: Car[] = [];

    filteredVehicles.forEach(vehicle => {
        if (vehicle.class.toLowerCase() == name) {

            showVehciles.push(vehicle);
        }
    });

    showVehciles = showVehciles.sort();

    res.render("class.ejs", { classe: name, vehicles: showVehciles });
});

app.get("/playstyles", (req, res) => {

    let uniquePlaystyles: ClassName[] = [];
    let filteredVehicles: Car[] = [...vehicles];

    filteredVehicles.forEach(vehicle => {

        const playStyle1Name = vehicle.playstyle[0].charAt(0).toUpperCase() + vehicle.playstyle[0].slice(1);
        const playStyle2Name = vehicle.playstyle[1].charAt(0).toUpperCase() + vehicle.playstyle[1].slice(1);

        if (!uniquePlaystyles.includes(playStyle1Name)) {

            uniquePlaystyles.push(playStyle1Name);
        }

        if (!uniquePlaystyles.includes(playStyle2Name)) {

            uniquePlaystyles.push(playStyle2Name);
        }
    });

    uniquePlaystyles = uniquePlaystyles.sort();

    res.render("playstyles.ejs", { playstyles: uniquePlaystyles });
});

app.get("/playstyle/:name", (req, res) => {

    let name: string = req.params.name.toLowerCase();

    let filteredVehicles: Car[] = [...vehicles];
    let showVehciles: Car[] = [];

    filteredVehicles.forEach(vehicle => {
        if (vehicle.playstyle[0].toLowerCase() == name || vehicle.playstyle[1].toLowerCase() == name) {
            showVehciles.push(vehicle);
        }
    });

    showVehciles = showVehciles.sort();

    res.render("playstyle.ejs", { playstyle: name, vehicles: showVehciles });
});


app.listen(app.get("port"), async () => {
    let dataFileOnline = "https://raw.githubusercontent.com/vstudiocode/milestone-2/main/data.json";
    let response = await fetch(dataFileOnline);
    let data: Car = await response.json();
    vehicles = data;
    // console.log(data);
    console.log("[server] http://localhost:" + app.get("port"))
});