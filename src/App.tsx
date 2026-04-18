import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import Database from "@tauri-apps/plugin-sql";
import "./App.css";

async function getFarmLocations(setFarmLocations: any) {
  const db = await Database.load("sqlite:run_tracker.db");
  const result = await db.select("select * from farm_locations;");
  setFarmLocations(result);
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [farmLocations, setFarmLocations] = useState([]);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }
  useEffect(() => {
    getFarmLocations(setFarmLocations);
  }, []);

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      {farmLocations.length === 0 ? (
        <p className="row">Loading...</p>
      ) : (
        <div className="row">
          {farmLocations.map((fl) => (
            <h5 key={fl.id}>{fl.location_name}</h5>
          ))}
        </div>
      )}
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
