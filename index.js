const path = require('path');
const PORT = process.env.PORT || 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.resolve(__dirname, '../climatechangenews')));

app.get('/climatecapi', (req, res) => {
  res.sendFile('/index.html')
})

const articles = [];

const newspapers = [
  {
    name: "guardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "thesun",
    address: "https://www.thesun.co.uk/topic/climate-change-environment/",
    base: "",
  },
  {
    name: "nypost",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
  {
    name: "independent",
    address: "https://www.independent.co.uk/climate-change/news",
    base: "https://www.independent.co.uk",
  },
  {
    name: "nypost",
    address: "https://nypost.com/tag/climate-change/",
    base: "",
  },
  {
    name: "inews",
    address: "https://inews.co.uk/topic/climate-change",
    base: "",
  },
  {
    name: "standard",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "metro",
    address: "https://metro.co.uk/tag/climate-change/",
    base: "",
  },
  {
    name: "smh",
    address: "https://www.smh.com.au/environment/climate-change",
    base: "https://www.smh.com.au",
  },
  {
    name: "dht",
    address: "https://www.dhakatribune.com/articles/climate-change",
    base: "https://www.dhakatribune.com",
  },
  {
    name: "africatimes",
    address: "https://africatimes.com/",
    base: "",
  },
  {
    name: "dm",
    address:
      "https://www.dailymail.co.uk/news/climate_change_global_warming/index.html",
    base: "",
  },
  {
    name: "metro",
    address: "https://metro.co.uk/tag/climate-change/",
    base: "",
  },
  {
    name: "theherald",
    address: "https://www.heraldscotland.com/business_hq/climateforchange/",
    base: "https://www.heraldscotland.com",
  },
  {
    name: "un",
    address: "https://news.un.org/en/news/topic/climate-change",
    base: "https://news.un.org",
  },
  {
    name: "nationalg",
    address:
      "https://www.nationalgeographic.com/environment/topic/climate-change",
    base: "",
  },
  {
    name: "thehindu",
    address: "https://www.thehindu.com/sci-tech/energy-and-environment",
    base: "",
  },
  {
    name: "nbc",
    address: "https://www.nbcnews.com/science/environment",
    base: "",
  },
  {
    name: "punch",
    address:
      "https://punchng.com/billions-needed-to-prepare-africas-cities-for-climate-change-group/",
    base: "",
  },
  {
    name: "apnews",
    address: "https://apnews.com/hub/climate-change",
    base: "https://apnews.com",
  },
  {
    name: "mail&guardian",
    address: "https://mg.co.za/tag/climate-change/",
    base: "",
  },
  {
    name: "bbc",
    address: "https://www.bbc.com/news/science-environment-56837908",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "time",
    address: "https://time.com/5864692/climate-change-defining-moment/",
    base: "",
  },
  {
    name: "globalnews",
    address: "https://globalnews.ca/tag/climate-change/",
    base: "",
  },
  {
    name: "dw",
    address: "https://www.dw.com/en/top-stories/environment/s-11798",
    base: "https://www.dw.com",
  },
];

//This function will run to retrieve data from the array and
//use the HTTP GET call the articles's response
newspapers.forEach((newspaper) => { 
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => console.log(err));
});

//Home endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Climate Change News API");
});


//Get all articles
app.get("/news", (req, res) => {
  res.json(articles);
});

//Get specific articles with Id
app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;

  //Get the a specific URL address by filtering the newspapers array
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  //Use axios to send request to server and get back the response with a callback function
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticle = [];

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticle.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticle);
    })
    .catch((err) => console.log(err));
}); 

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
