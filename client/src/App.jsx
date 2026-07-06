import { useEffect, useState } from "react";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    fetch("http://localhost:5000/api/message")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      });

  }, []);

  return (

    <div>

      <h1>SyncWave</h1>

      <h2>{message}</h2>

    </div>

  );

}

export default App;