export const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    msg.pitch = 1;
    msg.rate = 1;
    window.speechSynthesis.speak(msg);
};
