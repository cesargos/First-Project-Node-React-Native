const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const projects = [ ];

//middleware Global
function logRequest( req, res, next) {
  const {method, url} = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time('Request');
  console.log( logLabel );
  next(); //Chama o proximo middleware, usar return caso nao tenha codigo posterior
  console.timeEnd('Request');
}
app.use(logRequest);

//middleware global com rota
function validateProjectId( req, res, next ) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({error:"Invalid project ID."});
  }
  return next();
}
app.use('/projects/:id', validateProjectId);

//middleware local
function checkProjectInArray(req, res, next) {
  const { id } = req.params;

  const projectIndex = projects.findIndex( project => project.id === id);
  
  if (projectIndex < 0){
    return res.status(400).json({error: "Project not found."});
  };
  req.index = projectIndex;
  return next();
}

//CRUD - Create, Read, Update, Delete
app.post('/projects', (req, res) => {
  const { title, owner } = req.body;
  const project = {id: uuid(), title, owner}
  projects.push( project );
  return res.json( project );
});


app.get('/projects', (req, res) => {
  const {title} = req.query;
  
  const results = title 
    ? projects.filter( project =>project.title.includes(title))
    : projects;

  return res.json( results );
});

app.get('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;

  return res.json( projects[req.index]);
});
 
app.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const {title, owner} = req.body;
  
  const project = {id, title, owner };
  projects[req.index] =  project;

  return res.json( projects[ req.index ]);
});

app.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const {id} = req.params;

  projects.splice(req.index, 1);
  return res.status(204).send();
});



app.listen(3333, () => {
  console.log("🚀 Back-end started 🚀");
});