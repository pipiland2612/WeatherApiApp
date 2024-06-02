import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';
import { format, parseISO } from 'date-fns';

// Function to calculate formatted date
function calculateDateFormatted(numberOfDaysBefore) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - numberOfDaysBefore);
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // yyyy-mm-dd
}

// Function to get the day of the week
function getDayOfWeek(dateString) {
    const date = parseISO(dateString); // dateString : yyyy-mm-dd
    return format(date, 'EEEE').substring(0, 3);
}

//Pushing history data in an array
async function historyDayArray(data) {
    const historyDays = [];
    for (let i = 0; i < 4; i++) {
        historyDays.push({
            dayName: getDayOfWeek(calculateDateFormatted(4 - i)),
            avgTemp: data.forecast.forecastday[i].day.avgtemp_c,
            iconClass: ['bx-cloud', 'bx-sun', 'bx-cloud-rain', 'bx-cloud-drizzle'][i]
        });
    }
    return historyDays
}

// Variables
const apiKey = "d5d2b0f2e0f84b7aa9a102200241505";
const port = 3000;
const weatherUrl = "http://api.weatherapi.com/v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Get route
app.get("/", async (req, res) => {
    try {
        const [response1, response2] = await Promise.all([
            axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=Hanoi`),
            axios.get(`${weatherUrl}/history.json?key=${apiKey}&q=Hanoi&dt=${calculateDateFormatted(4)}&end_dt=${calculateDateFormatted(1)}`)
        ]);
        const result = response1.data;
        const historyData = response2.data;
        const historyDays = await historyDayArray(historyData);
        res.render("index.ejs", {
            result: result,
            dayName: getDayOfWeek(calculateDateFormatted(0)),
            historyData: historyData,
            historyDays: historyDays
        });
    } catch (error) {
        console.error(error);
    }
});

// Post route
app.post("/post", async (req, res) => {
    const location = req.body.id;

    try {
        const [response1, response2] = await Promise.all([
            axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=${location}`),
            axios.get(`${weatherUrl}/history.json?key=${apiKey}&q=${location}&dt=${calculateDateFormatted(4)}&end_dt=${calculateDateFormatted(1)}`)
        ]);
        const result = response1.data;
        const historyData = response2.data;

        const historyDays = await historyDayArray(historyData);
        res.render("index.ejs", {
            result: result,
            dayName: getDayOfWeek(calculateDateFormatted(0)),
            historyData: historyData,
            // ...historyDayNames
            historyDays: historyDays

        });
    } catch (err) {
        console.error(err.stack);
        res.status(400).json({ message: `Location :${location} is not valid` })
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

