import React,{useEffect, useState } from 'react';
import { SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';

import api from './services/api';

let i = 0;
export default function App(){
  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    console.log(`app rodando hehehehhe. ${i}`);

    api.get('/projects').then(res => {
      console.log(res.data);
      console.time('render');
      setProjects(res.data);
      console.timeEnd('render');
      
      i++;  
      console.log(`api carregada.`)
    });
  },[]);

  async function handleAddProject() {
    const response = await api.post('/projects', {
      title: `Novo projeto ${Date.now()}`,
      owner: 'Cesar Goulart'
    });
    const project = response.data;

    setProjects([...projects, project]);
  }
 
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#00000088"/>
      <SafeAreaView style={styles.container}>
        <Text>Cesar</Text>
        <FlatList           
          data={projects}
          keyExtractor={project => project.id}
          renderItem={({ item: project }) => (
            <Text style={styles.h1}>{project.title}</Text>
          )}
        />
        <TouchableOpacity 
          onPress={handleAddProject} 
          activeOpacity={0.6} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>Adicionar Projeto</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7159c1',
    flex: 1,
  },
  h1: {
    color: '#000',
    fontSize: 24,
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: '#FFF',
    margin: 20,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  }
});