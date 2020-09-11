import io from "socket.io-client";

export default function socket() {
  return (store) => {
    const socket = io(process.env.VUE_APP_SOCKET_URL);

    socket.on("userconnected", function(data) {
      if (store.getters["auth/isAuth"]) {
        socket.emit("map_sockets", store.getters["auth/token"]);
        store.dispatch("chat/getChannels");
      }
      store.commit("chat/setConnected", socket.connected);
    });

    socket.on("new_message", (data) => {
      store.commit("chat/receiveMessage", data);
    });
    socket.on("update_message_data", (data) => {
      store.commit("chat/updateMessageData", data);
    });
    socket.on("disconnect", (data) => {
      store.commit("chat/setConnected", socket.connected);
    });
    socket.on("peer_typing", (data) => store.commit("chat/peerTyping", data));
    socket.on("notification", (data) => {
      store.commit("notification/addNotifications", data);
    });

    store.subscribe((mutation) => {
      if (mutation.type === "auth/setUser") {
        socket.emit("authenticate", mutation.payload.token);
      }
      if (mutation.type === "chat/addMessage") {
        socket.emit("save_message", mutation.payload);
      }
      if (mutation.type === "chat/userTyping") {
        socket.emit("user_typing", mutation.payload);
      }
    });
  };
}
