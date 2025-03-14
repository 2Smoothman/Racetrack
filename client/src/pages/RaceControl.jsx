import "./RaceControl.css";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

// RaceControl
function RaceControl() {
  const socket = useContext(SocketContext);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  // get updated sessions when front-desk updates sessions
  useEffect(() => {
    if (!socket) return;

    socket.on("sessionsUpdated", (updatedSessions) => {
      setSessions(updatedSessions);
    });

    return () => {
      socket.off("sessionsUpdated"); // Cleanup to avoid memory leaks
    };
  }, [socket]);

  // get first session object with isConfirmed = true (front-desk has confirmed driver names)
  useEffect(() => {
    const firstConfirmedSession = sessions.find(
      (session) => session.isConfirmed === true
    );
    // if there is an ongoing active session, don't update currentSession
    if (!currentSession?.isActive && !currentSession?.isFinished) {
      setCurrentSession(firstConfirmedSession);
    }
  }, [sessions, currentSession]);
  console.log(currentSession);

  return (
    <div className="session-container">
      Race Control
      {currentSession?.isActive && (
        <FlagControls
          currentSession={currentSession}
          setCurrentSession={setCurrentSession}
        />
      )}
      <SessionInfo
        currentSession={currentSession}
        setCurrentSession={setCurrentSession}
        sessions={sessions}
        setSessions={setSessions}
        socket={socket}
      />
      <Link to="/" className="bbutton">
        Back to the main page
      </Link>
    </div>
  );
}

// FlagControls
function FlagControls({ currentSession, setCurrentSession }) {
  // change flags
  const changeFlag = (flag) => {
    if (!currentSession.isFinished) {
      setCurrentSession((prevSession) => ({
        ...prevSession,
        raceMode: flag,
      }));
    }
  };

  // Handle finish race
  const handleFinishRace = () => {
    setCurrentSession((prevSession) => ({
      ...prevSession,
      raceMode: "finish",
      isFinished: true,
      isActive: false,
    }));
  };

  return (
    <div className="flag-controls-container">
      Flag Controls
      <div className="flags-box">
        <div onClick={() => changeFlag("safe")} id="safe">
          SAFE
        </div>
        <div onClick={() => changeFlag("hazard")} id="hazard">
          HAZARD
        </div>
        <div onClick={() => changeFlag("danger")} id="danger">
          DANGER
        </div>
        <div onClick={() => handleFinishRace()} id="finish">
          FINISH
        </div>
      </div>
    </div>
  );
}

// SessionInfo
function SessionInfo({
  sessions,
  setSessions,
  currentSession,
  setCurrentSession,
  socket,
}) {
  const handleStartRace = () => {
    //change the current session flag to "safe" and isActive=true
    setCurrentSession((prevCurrentSession) => ({
      ...prevCurrentSession,
      isActive: true,
      raceMode: "safe",
    }));

    // remove the current session from general sessions array when race is started
    const currentSessionRemoved = sessions.filter(
      (session) => session.name !== currentSession.name
    );
    setSessions(currentSessionRemoved);

    // update new sessions data through socket
    socket.emit("raceStarted", currentSessionRemoved);
  };

  // Handle End Session
  const handleEndSession = () => {
    // when both isFinished and isActive are set to false, then useEffect sets
    // the next session from sessions array as currentSession
    setCurrentSession((prevCurrentSession) => ({
      ...prevCurrentSession,
      isFinished: false,
    }));
  };

  return (
    <div className="flag-controls-container">
      Session Info
      <div className="sessions-box">
        <div className="info-box">Current race mode:</div>
        {currentSession?.raceMode === "safe" &&
          currentSession?.isFinished === false && (
            <div className="info-box" id="safe">
              Safe
            </div>
          )}
        {currentSession?.raceMode === "hazard" &&
          currentSession?.isFinished === false && (
            <div className="info-box" id="hazard">
              Hazard
            </div>
          )}
        {currentSession?.raceMode === "danger" &&
          currentSession?.isFinished === false && (
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
      <div className="sessions-box">
        <div className="info-box">Race timer:</div>
        <div className="info-box">10:00:00</div>
      </div>
      <div className="sessions-box">
        <div className="info-box">
          {currentSession?.isActive || currentSession?.isFinished
            ? "Current Session:"
            : "Next Session:"}
        </div>
        <div className="info-box">
          {currentSession ? currentSession.name : "No upcoming sessions."}
        </div>
      </div>
      {currentSession &&
        !currentSession?.isActive &&
        !currentSession?.isFinished && (
          <button className="bbutton" onClick={handleStartRace}>
            Start Race
          </button>
        )}
      {currentSession && currentSession?.isFinished && (
        <button className="bbutton" onClick={() => handleEndSession()}>
          End Session
        </button>
      )}
    </div>
  );
}

export default RaceControl;
