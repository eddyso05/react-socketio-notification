import axios from "axios";
import toast from "react-hot-toast";

export const sendNotification = (name, friendName) => {
  axios
    .post("http://localhost:8080/notification", {
      name,
      friendName,
    })
    .then((res) => {
      console.log(res);
      toast(res.data, {
        icon: "👏",
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    });
};
