
export const clearLocalStorage = () => localStorage.clear()

export const removeAllAudioDevices = () =>{
    localStorage.removeItem("audioId");
    localStorage.removeItem("videoId");
    localStorage.removeItem("audioOutputId")
}