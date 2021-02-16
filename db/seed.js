
const { client, getAllUsers, createUser, updateUser } = require('./index');

async function createInitialUsers() {
  try {
    console.log("starting to create users....");
    const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'albertk', location: 'ny'});
    const sandra = await createUser({username: 'sandra', password: 'glamgal', name: 'sandrah', location: 'texas'});
    const glamgal = await createUser({username: 'glamgal', password: 'glamgal2', name: 'glamgal2', location: 'vegas'});
    console.log(albert);
    console.log(sandra)
    console.log("finished creating users!");
  }catch(error) {
    console.error("error creating users!");
    throw error;
  }
}

async function dropTables(){
  try{

    console.log("Starting to drop tables...");
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
    
    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

async function createTables(){
  try{
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
    `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function rebuildDB(){

  try{
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await updateUser();
  } catch (error) {
    throw error;
  } 
}

async function testDB() {
  try {
    console.log("Starting to test database...");
    console.log("calling getAllUsers")
    const users = await getAllUsers();
    console.log("result:", users);

    console.log("Calling updateUser on users[0]")
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "lesterville, KY"
    });
    console.log("Result:", updateUserResult);
    console.log("finished database tests!")
  } catch (error) {
    console.error(error);
    console.error("Error testing database!");

    throw error;
  } 
  }


rebuildDB()
.then(testDB)
.catch(console.error)
.finally(() => client.end());





