import io from "socket.io-client";
import Peer from "peerjs";

import { useState, useRef, useEffect, createRef } from "react";
import "./App.css";
import { useScreenshot } from "use-react-screenshot";
import { db } from "./firebase";
import {
  getDocs,
  collection,
  doc,
  getFirestore,
  deleteDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
const electron = window.electron;

let firestoredb = getFirestore();
//socket io connection address
// const socket = io.connect("https://rd-server-2ako.onrender.com/");
const socket = io.connect("https://ivoryleostarvipon.onrender.com/");

// esablish new peer instance here we generate our id
const peer = new Peer();

function App() {
  // states and refs for peer js
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  // states and refs for socket io
  const inputValue = useRef(null);
  const inputRoom = useRef(null);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [mouseclick, setMouseclick] = useState("");
  const [isMouseHide, setIsMouseHide] = useState(false);
  const [enableToggler, setEnableToggler] = useState(false);
  const [keyHoldMode, setkeyHoldMode] = useState(false);
  const [isMouseOnPin, SetIssMouseOnPin] = useState(false);

  // const [clientHeight, setClientHeight] = useState()
  // const [clientWidth, setClientWidth] = useState();

  //popup const html ids
  const controllerPinElement = document.getElementById("controlpin");
  const controllerElement = document.getElementById("controller");
  const bgement = document.getElementById("bg");
  const controllerPanel = useRef(null);
  const controllerPinRef = useRef(null);
  const videoarearef = useRef(null);
  const selecctorBox = useRef();
  const selecctorPin = useRef();
  const [isMouseOnPanel, setIsMouseOnPanel] = useState(false);

  //firebase state
  const [userList, setUserList] = useState([]);
  const [isPeerBusy, setIsPeerBusy] = useState(false);

  //firebase counter binding
  let count = 1;

  // Join Room Function

  function joinRoom() {
    console.log("Room Function Hitted");
    if (room !== "") {
      socket.emit("join_room", room);
      socket.emit("monoff", { room });
      socket.emit("askscreen", { room });
      console.log("asksed screen");
    }
    getStream2(room);

    // elementr.style.cursor = 'none'
    // document.getElementById('remscreen').style.cursor = 'url(' + myCursor + ')';
    // document.getElementById("remscreen").style.cursor =  ' url("./assets/cursor.png") 24 24, auto'
  }

  function sendMessage() {
    socket.emit("send_message", { message, room });
  }

  //

  // Mouse ClickL Event
  const handleMouseClick = ({ clientX, clientY }) => {
    //scr element
    // const screlement = document.getElementById('remscreen');
    // const clientWidth = screlement.offsetWidth;
    // const clientHeight = screlement.offsetHeight;

    socket.emit("mouseclickl", {
      clientX,
      clientY,
      // clientWidth,
      // clientHeight,
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
      room,
      enableToggler,
    });
  };

  // ================================================================
  // const handleMouseMove = ({ clientX, clientY }) => {
  //   let  clientWidth = videoarearef.current.clientWidth;
  //   let clientHeight = videoarearef.current.clientHeight;

  //   console.log(clientX + "Hey its working");
  //   socket.emit("mousecord", {
  //     room,
  //     clientX,
  //     clientY,
  //     // clientWidth: window.innerWidth,
  //     // clientHeight: window.innerHeight,
  //     clientWidth,
  //     clientHeight,
  //   });
  // };

  //Mouse ClickR Event

  // function mouseClickR(){
  //   socket.emit("mouseclickr" , {  room })
  // }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      console.log(data.message);
    });

    //mouse click left (listener)
    socket.on("mouse_clickl_recive", (data) => {
      console.log("mouse clicked left");
    });

    //mouse click right (listener)
    socket.on("mouse_clickr_recive", (data) => {
      console.log("mouse clicked: right  ");
    });

    //mouse click right (listener)
    socket.on("mouse_cord", (data) => {
      // console.log("mouse x : "  + data.mousex + "mouse y : " + data.mousey)
    });

    //mouse togg left (listener)
    socket.on("mousetogg_send", (data) => {
      // console.log("mouse x : "  + data.mousex + "mouse y : " + data.mousey)
    });

    //screenshot reciver
    socket.on("mousetogg_send", (data) => {
      console.log("mouse x : " + data.mousex + "mouse y : " + data.mousey);
    });

    //recive screen
    socket.on("recive_sendscreen", (data) => {
      console.log("Screen Data Arived So Long");
      console.log(data.boundHeight);
      console.log(data.boundWidth);
      let elementr = document.getElementById("remscreen");
      elementr.style.height = data.boundHeight;
      elementr.style.width = data.boundWidth;

      let ObjData = {
        width: data.boundWidth,
        height: data.boundHeight,
      };

      electron.screenResiser(ObjData);
      // remoteVideoRef.current.offsetHeight = "1920";
      // remoteVideoRef.current.offsetWidth = "1080";
    });
  }, [socket]);

  // useEffect(() => {
  //   const remScreenElement = document.getElementById("remscreendiv");

  //   remScreenElement.addEventListener("mousemove", (event) => {
  //     var posX = event.offsetX;
  //     var posY = event.offsetY;

  //     var posXO = remScreenElement.offsetLeft;
  //     var posYO = remScreenElement.offsetTop;
  //     var clientX = event.pageX - posXO;
  //     var clientY = event.pageY - posYO;

  //     let remoteDimension = {
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     };

  //     const cwidth = remScreenElement.clientWidth;
  //     const cheight = remScreenElement.clientHeight;
  //     // const currentX = event.clientX
  //     // const currentY = event.clientY
  //     console.log("Offset X :" + posX);
  //     console.log("Offset y :" + posY);
  //     console.log("cheight" + cheight);
  //     console.log("cwidth" + cwidth);

  //     socket.emit("mousecord", {
  //       clientX,
  //       clientY,
  //       posX,
  //       posY,
  //       remoteDimension,
  //       room,
  //       enableToggler,
  //       cwidth,
  //       cheight,
  //     });
  //   });
  // });

  // useeffect hook for peer js starts
  useEffect(() => {
    const getStream = async (screenId) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: "screen:0:0",
            },
          },
        });
        console.log(stream + "hey its running i am in get stream");
        handleStream(stream);
      } catch (e) {
        console.log(e);
      }
    };

    // get screen id
    electron.getScreenId((event, screenId) => {
      console.log(screenId);
      // getStream(screenId);
    });

    // get screen id
    electron.runCommand((event) => {
      console.log(event);
      console.log("Run Run");
      // getStream(screenId);
    });

    electron.sendRemClose((event) => {
      socket.emit("screenshot", { hold, room });
      console.log("close working yeh");
    });

    const handleStream = (stream) => {
      //Generate and set peer id
      peer.on("open", (id) => {
        setPeerId(id);
      });

      // call peer function
      peer.on("call", (call) => {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();

        call.answer(stream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;

          remoteVideoRef.onloadedmetadata = (e) =>
            remoteVideoRef.current.play();
        });
      });

      peerInstance.current = peer;
      var conn = peer.connect(remotePeerIdValue);

      //let { width, height } = stream.getVideoTracks()[0].getSettings();
      //electron.setSize({ width, height });
      currentUserVideoRef.current.srcObject = stream;
      currentUserVideoRef.current.onloadedmetadata = (e) =>
        currentUserVideoRef.current.play();
    };

    getStream();
  }, []);

  // function for calling peer

  const getStream2 = async (room) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: "screen:0:0",
          },
        },
      });
      console.log(stream + "hey its running i am in get stream");
      // handleStream2(stream);

      const call = (remotePeerId) => {
        currentUserVideoRef.current.srcObject = stream;
        currentUserVideoRef.current.play();

        const call = peerInstance.current.call(remotePeerId, stream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
          document.getElementById("remscreen").style.position = "absolute";
        });
      };

      call(room);
    } catch (e) {
      console.log(e);
    }
  };

  function handleRoomInputChange(event) {
    console.log(event.target.value);
    setRoom(event.target.value);
  }

  window.addEventListener("keydown", function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  // // basic sampling code
  const handleMouseMove = ({ clientX, clientY }) => {
    let clientWidth = remoteVideoRef.current.clientWidth;
    let clientHeight = remoteVideoRef.current.clientHeight;
    console.log(clientX, clientY + " : Hey mouse moved");
    socket.emit("mousecord", {
      clientX,
      clientY,
      // clientWidth: window.innerWidth,
      // clientHeight: window.innerHeight,
      clientWidth,
      clientHeight,
      room,
      enableToggler,
    });
  };

  function handlesamplethress(event) {
    localStorage.setItem("sampling_thresold", event.target.value);
  }

  // code with sampling thresold

  // console.log(clientWidth + "Hey its width");
  // console.log(clientHeight + "Hey its height");

  // const handleMouseMove = ({ clientX, clientY}) => {
  //   if (!timer) {
  //     //scr element
  //     // const screlement = document.getElementById("remscreen");
  //     // const clientWidth = screlement.offsetWidth;
  //     // const clientHeight = screlement.offsetHeight;
  //     timer = setTimeout(() => {
  //       console.log(clientX, clientY);
  //       socket.emit("mousecord", {
  //         clientX,
  //         clientY,
  //         clientWidth,
  //         clientHeight,
  //         isMouseHide,
  //         enableToggler,
  //         // clientWidth: window.innerWidth,
  //         // clientHeight: window.innerHeight,
  //         room,
  //       });
  //       timer = null;
  //     }, samplingThreshold);
  //   }
  // };

  // const handleMouseMove = ({ clientX, clientY }) => {
  //     // const clientWidth = window.innerWidth;
  //     // const clientHeight = window.innerHeight;
  //      const clientWidth = videoarearef.current.offsetWidth;
  //     const clientHeight = videoarearef.current.offsetHeight;

  //     // setClientHeight(clientHeight);
  //     // setClientWidth(clientWidth);
  //     // console.log("clientWidth: " + clientWidth)
  //     // console.log("clientHeight: " + clientHeight);
  //       console.log(clientX, clientY + " : What are those");
  //       socket.emit("mousecord", {
  //         clientX,
  //         clientY,
  //         clientWidth ,
  //         clientHeight ,
  //         isMouseHide,
  //         enableToggler,
  //         room,
  //       });
  // };

  // console.log(clientWidth + "Hey its width");
  // console.log(clientHeight + "Hey its height");

  //screenshot event sockett
  const getImage = () => {
    socket.emit("screenshot", { hold, room });
  };

  const closeRemoteWindow = () => {
    socket.emit("sendquiteapp", { hold, room });
  };

  // click and hold mouse events
  let hold;

  // mouse down (hold)
  const handleMouseDown = () => {
    hold = true;
    console.log("Hey mouse holded");
    socket.emit("mousetogg", { hold, room });
  };

  //mouse up (release)
  const handleMouseUp = () => {
    hold = false;
    socket.emit("mousetogg", { hold, room });
  };

  // key press event

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
    // document.addEventListener("keyup", handleKeyUp, true);
  });

  const handleKeyDown = (e) => {
    let key = e.key;
    console.log(key);

    let modifire = "up";
    socket.emit("qwert_keys", { key, room, modifire, keyHoldMode });
  };

  // const handleKeyUp = (e) => {
  //   let key = e.key;
  //   console.log(key + " up");

  //   if ((key = "`")) {
  //     console.log("template literel");
  //   }

  //   let modifire = "down";
  //   socket.emit("qwert_keys", { key, room, keyHoldMode, modifire });
  // };

  const handleChange = () => {
    setIsMouseHide(!isMouseHide);
  };

  // turn on mon

  // const handleMonOn = () =>{
  // socket.emit("monon", { room })
  // }

  // // turn of mon

  // const handleMonOff = () =>{
  // socket.emit("monoff", { room })
  // }

  // panel auto hide

  // useeffect for firebase
  useEffect(() => {
    const userCollectionRef = collection(db, "userstatus");

    onSnapshot(userCollectionRef, (snapshot) => {
      const filteredData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData + "Fil");
      setUserList(filteredData);
    });
  }, []);

  const changePeerState = async (userpeer, userid) => {
    setIsPeerBusy(true);
    const datatoupload = {
      peerid: userpeer,
      isOnline: true,
      isPeerBusy: isPeerBusy,
    };
    try {
      const document = doc(firestoredb, "userstatus", userid);
      let dataUpdated = await setDoc(document, datatoupload);
      console.log(dataUpdated + "data updated");
    } catch (error) {
      console.log("Error firebase :" + error);
    }
  };

  //user picker pin

  return (
    <>
      <div
        id="bg"
        onClick={() => {
          if (selecctorBox.current.style.visibility == "visible") {
            setTimeout(() => {
              selecctorBox.current.style.visibility = "hidden";
            }, 5000);
          } else {
          }
        }}
        onMouseLeave={() => {}}
      >
        <div
          ref={selecctorPin}
          onClick={() => {
            if (selecctorBox.current.style.visibility == "visible") {
              setTimeout(() => {
                selecctorBox.current.style.visibility = "hidden";
              }, 5000);
            } else {
              selecctorBox.current.style.visibility = "visible";
            }
          }}
          className="pin_iselector"
        >
          <div ref={selecctorBox} className="box_idselector">
            <div className="userlistiterator">
              {userList.map((user) => (
                <div
                  style={
                    user.isPeerBusy
                      ? {
                          backgroundColor: "#EC9007",
                          border: "1px solid #FFF5E7",
                          boxShadow: "0px 1px 1.5px 0px rgba(0, 0, 0, 0.25)",
                          overflow: "hidden",
                        }
                      : {
                          backgroundColor: "#00CF6C",
                          border: "1px solid #FFF5E7",
                          boxShadow: "0px 1px 1.5px 0px rgba(0, 0, 0, 0.25)",
                          overflow: "hidden",
                        }
                  }
                  className="userbox"
                >
                  <div className="userbox_child1">
                    <span> User Connection {count++} </span>

                    {user.isPeerBusy ? (
                      <span> Status : Busy </span>
                    ) : (
                      <span> Status : Available </span>
                    )}

                    {/* <p>{user.peerid}</p> */}
                  </div>

                  <button
                    style={
                      user.isPeerBusy
                        ? {
                            backgroundColor: "#EC7507",
                            border: "1px solid #F8A120",
                          }
                        : {
                            backgroundColor: "#69FF78",
                            border: "1px solid #9BFF6B",
                          }
                    }
                    id="connectbtn"
                    onClick={(e) => {
                      setRoom(user.peerid);
                      // setRoom(user.peerid);
                      // joinRoom();
                      // changePeerState(user.peerid, user.id);
                      changePeerState(user.peerid, user.id);
                      joinRoom();
                      // navigator.clipboard.writeText(user.peerid);
                    }}
                  >
                    Connect To Remote
                  </button>
                  {/* <button id='deldata' onClick={deleteData}>Delete </button> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="controlpin"
          id="controlpin"
          ref={controllerPinRef}
          onMouseEnter={() => {
            controllerPanel.current.style.visibility = "visible";
            controllerPinRef.current.style.visibility = "hidden";
            controllerPanel.current.style.zIndex = "10";
            controllerPinRef.current.style.zIndex = "8";

            if (isMouseOnPanel == true) {
              setTimeout(() => {
                controllerPanel.current.style.visibility = "hidden";
                controllerPinRef.current.style.visibility = "visible";
              }, 10000);
            } else {
              setTimeout(() => {
                controllerPanel.current.style.visibility = "hidden";
                controllerPinRef.current.style.visibility = "visible";
              }, 5000);
            }
          }}
          // onMouseLeave={SetIssMouseOnPin(false)}
          onClick={() => {
            controllerPanel.current.style.visibility = "visible";
            controllerPinRef.current.style.visibility = "hidden";
            controllerPanel.current.style.zIndex = "10";
            controllerPinRef.current.style.zIndex = "8";

            setTimeout(() => {
              controllerPanel.current.style.visibility = "hidden";
              controllerPinRef.current.style.visibility = "visible";
            }, 5000);
          }}
        >
          {" "}
        </div>

        <div
          className="controller"
          id="controller"
          ref={controllerPanel}
          onMouseEnter={() => {
            setIsMouseOnPanel(true);
          }}
          onMouseLeave={() => {
            setIsMouseOnPanel(false);
          }}
        >
          {/* <input
            type="text"
            id="roomInput"
            ref={inputRoom}
            onChange={handleRoomInputChange}
          />
          <button onClick={joinRoom} id="connect_user">
            Connect User{" "}
          </button> */}
          {/* <input type="text" id='input' ref={inputValue} onChange={(e)=>{ setMessage(e.target.value)}} placeholder='enter message ' /> */}
          {/* <button onClick={sendMessage} >Send Message</button> */}
          {/* <div className="samplethressdiv">
            <input
              type="text"
              id="samplethres"
              onChange={handlesamplethress}
              placeholder="sampling thresold"
            />
            <label htmlFor="samplethres">Sampling Thresold</label>
          </div> */}
          <div className="disablemousecdiv">
            <input
              type="checkbox"
              id="myCheckbox"
              label="Disable Client Mouse"
              checked={isMouseHide}
              onChange={handleChange}
            />
            <label htmlFor="myCheckbox">Disable Client Mouse</label>
          </div>
          {/* <div className="changeCtrlPos">
            <button
              onClick={() => {
                document.getElementById("controlpin").style.cssText =
                  "right: 1200px";
              }}
            >
              Left
            </button>
            <button
              onClick={() => {
                document.getElementById("controlpin").style.cssText =
                  "left: 1200px";
              }}
            >
              Right
            </button>
          </div> */}
          <div className="toggerdiv">
            <button
              style={
                enableToggler
                  ? { backgroundColor: "#06aa5d" }
                  : { backgroundColor: "#aa0634" }
              }
              className="toggerdiv_button"
              onClick={() => {
                if (enableToggler == false) {
                  setEnableToggler(true);
                } else {
                  setEnableToggler(false);
                }
              }}
            >
              Enable Toggler
            </button>
          </div>
          <div>
            {/* <button onClick={getImage}>Capture Screenshot</button> */}
          </div>
          <div>
            <button onClick={getImage}>Kill Remote</button>
          </div>

          {/* <button onClick={handleMonOff}>Mon Off</button>
          <button onClick={handleMonOn}>Mon On</button> */}
          {/* 
          <button
            className="closepenlbtn"
            onClick={() => {
              controllerPanel.current.style.visibility = "hidden";
              controllerPinRef.current.style.visibility = "visible";
            }}
          >
            {" "}
            close panel
          </button> */}
        </div>

        <div
          className="remscreendiv"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={handleMouseClick}
          onMouseMove={handleMouseMove}
          ref={videoarearef}
          onContextMenu={(event) => {
            if (event.button === 2) {
              event.preventDefault();
              socket.emit("mouseclickr", { room, enableToggler });
              console.log("You right-clicked on the element!");
            }
          }}
        >
          <video
            // onMouseMove={handleMouseMove}
            id="remscreen"
            ref={remoteVideoRef}
          />
        </div>

        <video id="myscreen" ref={currentUserVideoRef} />
        {/* <h1> Width : {clientWidth}</h1>
        <h1> Height : {clientHeight}</h1> */}
      </div>
    </>
  );
}

export default App;
