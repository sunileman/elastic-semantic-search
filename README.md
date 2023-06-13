# elastic-semantic-search
Demo Elastic Learned Sparse EncodeR (ELSER)


## Setup
- Ensure ML Nodes are running
- Download and deploy [ELSER](https://www.elastic.co/guide/en/machine-learning/current/ml-nlp-elser.html#download-deploy-elser "ELSER")
- Upload movie_plots.csv via Kibana to a new index named `wiki-movie-plot-raw`.  Ignore any errors during upload
- Install npm modules
  - npm install express
  - npm install @elastic/elasticsearch
  - npm install html
  - npm install axios
  - Create the demo index
```
PUT elser-movie-demo
{
  "mappings": {
    "properties": {
      "ml.tokens": {
        "type": "rank_features" 
      },
      "text_field": {
        "type": "text" 
      }
    }
  }
} 
```

 - Create ingest pipeline
```
PUT _ingest/pipeline/elser-movie-test
{
  "processors": [
    {
      "inference": {
        "model_id": ".elser_model_1",
        "target_field": "ml",
        "field_map": {
          "Plot": "text_field"
        },
        "inference_config": {
          "text_expansion": { 
            "results_field": "tokens"
          }
        }
      }
    }
  ]
}
```
 - Reindex raw movie plot index into the demo index 
```
POST _reindex?wait_for_completion=false
{
  "source": {
    "index": "wiki-movie-plot-raw"
  },
  "dest": {
    "index": "elser-movie-demo",
    "pipeline": "elser-movie-test"
  }
}
```
This will return a task ID.  Monitor progress of the reindex `GET _tasks/<TaskID>`

 - Point the UI to a ES endpoint.  Updated searchdemo.js
```
const client = new Client({
    cloud: {
      id: '<ESS CloudID>'
    },
    auth: {
      username: '<Elastic User Name>',
      password: '<Elastic Password>'
    }
  })
```


- Launch the UI
 - `node searchdemo.js`

------------

Search for movies.  For example `movie about romance and pain of separation`
