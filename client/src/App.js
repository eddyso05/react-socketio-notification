import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { TextField, Button } from "@mui/material";
// import local url
import { sendNotification } from "./services/sendNotification.js";

function App() {
  const [name, setName] = useState(undefined);
  const nameRef = useRef();
  const friendNameRef = useRef();

  useEffect(() => {
    if (name) {
      const socket = io("http://localhost:8080", {
        extraHeaders: {
          Authorization: name,
        },
      });
      socket.on("connect", function () {
        socket.on("notification", (arg) => {
          toast(arg);
        });
      });
      socket.on("disconnect", function () {
        //Your Code Here
        toast("Server disconnected");
      });

      return () => {
        // before the component is destroyed
        // unbind all event handlers used in this component
        socket.off("connect");
        socket.off("disconnect");
        socket.off("notification");
      };
    }
  }, [name]);

  return (
    <div className="App">
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {!name ? (
          <>
            <TextField
              id="outlined-basic"
              label="Your name"
              inputRef={nameRef}
            />
            <Button
              style={{ margin: "5px" }}
              variant="contained"
              onClick={() => {
                setName(nameRef.current.value);
              }}
              size="large"
            >
              Enter
            </Button>
          </>
        ) : (
          <>
            <TextField
              id="outlined-basic"
              label="Your friend name"
              inputRef={friendNameRef}
            />
            <Button
              variant="contained"
              style={{ margin: "5px" }}
              onClick={() => {
                sendNotification(name, friendNameRef.current.value);
              }}
            >
              send notification
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
