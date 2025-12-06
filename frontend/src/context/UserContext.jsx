import { createContext, useState, useContext } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [loginStatus,setLoginStatus] = useState(false);
  const [eventAddPopUp ,setEventAddPopUp] = useState(false);
  const [fcmtoken, setFcmtoken] = useState("");
  const [showhideoptions, setShowhideoptions] = useState(false);
  const [username, setUsername] = useState("");
  const [updateEventPopup,setUpdateEventPopup] = useState(false);
  
  return (
    <UserContext.Provider value={{loginStatus, setLoginStatus, updateEventPopup ,setUpdateEventPopup ,eventAddPopUp ,setEventAddPopUp,showhideoptions, setShowhideoptions,username, setUsername ,fcmtoken, setFcmtoken}}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
