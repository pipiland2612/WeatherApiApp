import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';

// calculation the name of the current day
function dayName() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = daysOfWeek[dayOfWeek];
    return dayName
}

function calculateDateFormatted(numberOfdayBefore) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - numberOfdayBefore);
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}
//variables
const apiKey = "d5d2b0f2e0f84b7aa9a102200241505";
const port = 3000;
const weatherUrl = "http://api.weatherapi.com/v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
    try {
        const [response1, response2] = await Promise.all([
            axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=Hanoi`),
            axios.get(`${weatherUrl}/history.json?key=${apiKey}&q=Hanoi&dt=${calculateDateFormatted(4)}&end_dt=${calculateDateFormatted(1)}`)
        ]);
        const result = response1.data;
        const historyData = response2.data;
        res.render("index.ejs", {
            // historyIcon1: historyData.forecast.forecastday[0].day.condition.icon,
            // historyIcon2: historyData.forecast.forecastday[1].day.condition.icon,
            // historyIcon3: historyData.forecast.forecastday[2].day.condition.icon,
            // historyIcon4: historyData.forecast.forecastday[3].day.condition.icon,
            result: result,
            dayName: dayName(),
            historyData: historyData,
        })
    } catch (error) {
        if (error.response) {
            console.log(error)
        }
    }
})

app.post("/post", async (req, res) => {
    try {
        const location = req.body.id;
        const [response1, response2] = await Promise.all([
            axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=${location}`),
            axios.get(`${weatherUrl}/history.json?key=${apiKey}&q=${location}&dt=${calculateDateFormatted(4)}&end_dt=${calculateDateFormatted(1)}`)
        ]);
        const result = response1.data;
        const historyData = response2.data;
        res.render("index.ejs", {
            result: result,
            dayName: dayName(),
            historyData: historyData,
        })
    } catch (error) {
        console.log(error)
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});