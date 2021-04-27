import fs from 'fs';
import Client from '@replit/database';
import ReplAPI from '../';

const client = new Client();

const replapi = ReplAPI({
  username: 'RayhanADev',
  experimentalFeatures: true,
  createDatabaseFlag: true,
});

const myTestClass = new replapi.Database('', 'Furretz', {
	collaborators: {
		'HelperFurret': { access: 'write' },
	},
	password: 'Furr3tz',
	type: 'plus',
});
await myTestClass.init();

async function myTestFunction() {
	// Creation
  /*await myTestClass.createCollection('test_collection');
  await myTestClass.createDoc('test_collection', 'test_doc_0', {
  	name: 'Furret',
  	cuteness: '10/10',
  	evolutionStage: 2,
  	'pre-evolution': {
  		name: 'Sentret',
  	}
  });
  
  await myTestClass.createDoc('test_collection', 'test_doc_1', {
  	pokemon: 'Pikachu',
  	cuteness: '8/10',
  	evolutionStage: 2,
  	'pre-evolution': {
  		name: 'Pichu',
  	}
  });
  
  await myTestClass.createDoc('test_collection', 'test_doc_2', {
  	pokemon: 'Minccino',
  	cuteness: '7/10',
  	evolutionStage: 1,
  	'pre-evolution': false
  });
  
  
	const collection = await myTestClass.getCollection('test_collection');
  console.log('Collection', collection);
  const doc = await myTestClass.getDoc('test_collection', 'test_doc_2');
  console.log('Document', doc);*/
  
  // Updating
  /*await myTestClass.updateDoc('test_collection', 'test_doc_2', { 
  	pokemon: 'Cinccino', 
  	evolutionStage: 2, 
  	cuteness: '6/10', 
  	'pre-evolution': { 
  		name: 'Minccino'
  	}
  });
	
	const collection_2 = await myTestClass.getCollection('test_collection');
  console.log('Collection2', collection_2);
  const doc_2 = await myTestClass.getDoc('test_collection', 'test_doc_2');
  console.log('Document2', doc_2);*/
  
  // Compare to ReplDB
  /*const keys = await client.getAll();
  console.log('From ReplDB', keys)*/
//  fs.writeFileSync('./test/test.json', JSON.stringify(info), { encoding: 'utf8' });
}

myTestFunction();