import React, { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';
import backgroundImage from './assets/background.jpeg';

import Header from './components/Header';

function App() {
  const [projects, setProjects] = useState([]);

  useEffect( () => {
    api.get('projects').then( response => { //pode usar async/await ( api.get chama uma function e dentro dessa function outra funcition async/await pois nao pode eh recomendado usar function async no useEffect)
      console.log(response);
      setProjects(response.data);
    })
  }, []);

  async function handleAddProject(){
   // setProjects([...projects,{id:Date.now(), title:`Novo projeto ${Date.now()}`}]);

   const response = await api.post('projects', {
     title: `Novo projeto ${Date.now()}`,
     owner: 'Cesar Goulart'
   });

   const project = response.data;
   setProjects([...projects, project]);

  }

  return (
    <>
      <Header title="Homepage">
        <ul>
          <li>Homepage</li>
          <li>project</li>
          <li>Login</li>
        </ul>
      </Header>
      <Header title="Projects" />

      <ul>
        {projects.map(project => <li key={project.id}>{project.title}</li>)}
      </ul>
      <button type="button" onClick={handleAddProject}> Adicionar projeto</button>
      <br></br>
      <img width={300}src={backgroundImage} />
    </>
  );  
}

export default App;