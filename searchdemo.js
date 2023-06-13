const express = require('express');
const axios = require('axios');
const path = require('path');
const { Client } = require('@elastic/elasticsearch')
const app = express();  // Define app here


const client = new Client({
  cloud: {
    id: '<ESS cloud id>'
  },
  auth: {
    username: '<username>',
    password: '<password>'
  }
})

app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
    const searchTerm = req.query.term;

    if (!searchTerm) {
        return res.status(400).send("Please enter a search term");
    }

    try {
        const results = await client.search({
          index: 'elser-movie-demo',
          body: {
            query: {
              text_expansion: {
                "ml.tokens": {
                  "model_id": ".elser_model_1",
                  "model_text": searchTerm
                }
              }
            }
          }
        });

    const sources = results.hits.hits.map(hits => hits._source);
    res.json(sources);
    console.log(results.hits.hits)


    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while querying Elasticsearch.');
    }
});


app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
