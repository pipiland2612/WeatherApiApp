import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from 'url';

// calculation the name of the current day
const today = new Date();
const dayOfWeek = today.getDay();
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dayName = daysOfWeek[dayOfWeek];

// calculation the date of 4 days before
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 4);
const year = currentDate.getFullYear().toString().slice(2);
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const day = currentDate.getDate().toString().padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

//variables
const apiKey = "d5d2b0f2e0f84b7aa9a102200241505";
const port = 3000;
const weatherUrl = "http://api.weatherapi.com/v1";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get("/", async (req, res) => {
    try {
        // axios.all([
        //     axios.get(`/my-url`), 
        //     axios.get(`/my-url2`)
        //   ])
        //   .then(axios.spread((data1, data2) => {
        //     // output of req.
        //     console.log('data1', data1, 'data2', data2)
        //   }));
        const response = await axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=Hanoi`);
        // const history = await axios.get(`${weatherUrl}/history.json?key=${apiKey}&q=Hanoi&dt=${formattedDate}&end_dt=2024-05-14`)
        const result = response.data;
        // const historyData = history.data;
        res.render("index.ejs", {
            location: result.location.name,
            dayName: dayName,
            localTime: result.location.localtime,
            temperature: response.data.current.temp_c,
            conditionText: result.current.condition.text,
            conditionIcon: result.current.condition.icon,
            precip_mm: result.current.precip_mm,
            humidity: result.current.humidity,
            wind_kph: result.current.wind_kph,

            // historyTempt1: historyData.forecast.forecastday[0].day.avgtemp_c,
            // historyTempt2: historyData.forecast.forecastday[1].day.avgtemp_c,
            // historyTempt3: historyData.forecast.forecastday[2].day.avgtemp_c,
            // historyTempt4: historyData.forecast.forecastday[3].day.avgtemp_c,

            // historyIcon1: historyData.forecast.forecastday[0].day.condition.icon,
            // historyIcon2: historyData.forecast.forecastday[1].day.condition.icon,
            // historyIcon3: historyData.forecast.forecastday[2].day.condition.icon,
            // historyIcon4: historyData.forecast.forecastday[3].day.condition.icon,
        })
    } catch (error) {
        if (error.response) {
            console.log('Error data:', error.response.data);
            console.log('Error status:', error.response.status);
            console.log('Error headers:', error.response.headers);
        } else if (error.request) {
            console.log('Error request:', error.request);
        } else {
            console.log('Error message:', error.message);
        }
        console.log('Error config:', error.config);
    }
})

app.post("/post", async (req, res) => {
    try {
        const location = req.body.id;
        const response = await axios.get(`${weatherUrl}/current.json?key=${apiKey}&q=${location}`);
        const result = response.data;
        res.render("index.ejs", {
            location: result.location.name,
            dayName: dayName,
            localTime: result.location.localtime,
            temperature: response.data.current.temp_c,
            conditionText: result.current.condition.text,
            conditionIcon: result.current.condition.icon,
            precip_mm: result.current.precip_mm,
            humidity: result.current.humidity,
            wind_kph: result.current.wind_kph,

        })
    } catch (error) {
        if (error.response) {
            console.log('Error data:', error.response.data);
            console.log('Error status:', error.response.status);
            console.log('Error headers:', error.response.headers);
        } else if (error.request) {
            console.log('Error request:', error.request);
        } else {
            console.log('Error message:', error.message);
        }
        console.log('Error config:', error.config);
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});