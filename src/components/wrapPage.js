import React from "react";

export default ({ bg, children }) => (
  <div
    style={{
      display: "flex",
      flex: "1",
      backgroundColor: "white",
      justifyContent: "center",
      flexDirection: "row"
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "375px",
        height: "100vh",
        minHeight: "667px",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover"
      }}
    >
      {children}
    </div>
  </div>
);
