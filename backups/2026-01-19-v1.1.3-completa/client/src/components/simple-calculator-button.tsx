import React from "react";

const SimpleCalculatorButton = () => {
  return (
    <div style={{
      margin: "20px auto",
      padding: "20px 0",
      textAlign: "center",
      backgroundColor: "#3182ce"
    }}>
      <a 
        href="https://waybank-delta-neutral-calculator.replit.app/" 
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          padding: "15px 30px",
          backgroundColor: "#fff",
          color: "#3182ce",
          fontSize: "18px",
          fontWeight: "bold",
          borderRadius: "8px",
          textDecoration: "none"
        }}
      >
        CALCULADORA DELTA NEUTRAL
      </a>
    </div>
  );
};

export default SimpleCalculatorButton;