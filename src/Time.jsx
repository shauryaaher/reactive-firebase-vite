import { useState, useEffect } from "react";

export default function CompyTime() {
  const [time, setTime] = useState(new Date().toString());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toString()), 1000);
    return () => {
      clearInterval(interval);
    };
  });
  return (
    <center>
      <h4>Current date: {time}</h4>
    </center>
  );
}
