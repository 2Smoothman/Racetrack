import React, { useContext, useEffect, useState } from "react";
import "./LeaderBoard.css";
import { SocketContext } from "../context/SocketContext";
import RaceTimer from "../components/RaceTimer";
import { Link } from "react-router-dom";

function LeaderBoard() {
  const [enableUpdateSession, setEnableUpdateSession] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    // get updated currentSession from server on connection
    socket.on("getCurrentSession", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });
    // get updated enableUpdateSession from server on connection
    socket.on("getEnableUpdateSession", (updatedEnableUpdateSession) => {
      setEnableUpdateSession(updatedEnableUpdateSession);
    });
    // update leaderboard when lap is added
    socket.on("addedLap", (updatedCurrentSession) => {
      setCurrentSession(updatedCurrentSession);
    });

    // disable fetching new session until next race has started
    socket.on("startedRaceAlert", () => {
      setEnableUpdateSession(true);
      socket.emit("requestCurrentSession");
    });
    socket.on("sessionHasEnded", () => {
      setEnableUpdateSession(false);
    });

    socket.on("currentSessionUpdated", (updatedCurrentSession) => {
      if (enableUpdateSession) {
        setCurrentSession(updatedCurrentSession);
      }
    });

    return () => {
      socket.off("getCurrentSession");
      socket.off("getEnableUpdateSession");
      socket.off("addedLap");
      socket.off("startedRacelert");
      socket.off("sessionHasEnded");
      socket.off("currentSessionUpdated");
    };
  }, [socket, enableUpdateSession]);

  // for testing
  useEffect(() => {
    console.log(enableUpdateSession);
  }, [enableUpdateSession]);

  return (
    <div className="lb-container">
      Leader Board
      {!currentSession?.isFinished && (
        <div className="lb-sessions-box">
          <div className="info-box">Race timer:</div>
          <div className="info-box" id="timer">
            <RaceTimer timerIsActive={currentSession?.isActive} startTime={currentSession?.startTime} />
          </div>
        </div>
      )}
      <div className="lb-sessions-box">
        <div className="info-box">Current race mode:</div>
        {currentSession?.raceMode === "safe" && currentSession?.isFinished === false && (
          <div className="info-box" id="safe">
            Safe
          </div>
        )}
        {currentSession?.raceMode === "hazard" && currentSession?.isFinished === false && (
          <div className="info-box" id="hazard">
            Hazard
          </div>
        )}
        {currentSession?.raceMode === "danger" && currentSession?.isFinished === false && (
          <div className="info-box" id="danger">
            Danger
          </div>
        )}
        {currentSession?.isFinished === true && (
          <div className="info-box" id="finish">
            Finished
          </div>
        )}
      </div>
      <div className="bottom-area">
      <div className="leader-board-container">
        {!currentSession && "No active sessions."}
        {currentSession &&
          currentSession.leaderBoard.map((driver, index) => (
            <div className="lb-position" key={driver.name}>
              #{index + 1}: Car {driver.car} | {driver.name} | Current lap: {driver.laps.length + 1 || 1} | Best Lap:{" "}
              {driver.bestLap}
            </div>
          ))}
      </div>
      <div>
        <Link reloadDocument to="/" className="bbutton" id="linkback">
          Back to the main page
        </Link>
      </div>
      </div>
    </div>
  );
}

export default LeaderBoard;
