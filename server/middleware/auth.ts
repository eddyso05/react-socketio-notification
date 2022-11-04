// you can protect websocket request by jwt or other method depend on your project
// protect websocket request and identity the user id
// since here is the real time messaging is what we focus for, i just use id without any authorization
const protect = async (name: string, socket) => {
  if (!name) {
    return false;
  }

  if (socket.handshake.query && name) {
    try {
      socket.name = name;
      return socket.name;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  return false;
};

export { protect };
