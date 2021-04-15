const Info = ({ mounting, onClick }) => {
    return (
        <div className={`overlay ${mounting ? "" : "fade-out"}`} onClick={onClick}>
            <h3 style={{ paddingTop: 20 }} >Welcome to the <i><strong>Darkest Hour Radio</strong></i></h3>
            <h5>We pirate for your entertainment.</h5>
            <div id="overlay-text">
                <h5 id="schedule-header">Live radio show schedule:</h5><hr/><br/>
                <p id="schedule-main">Evening Vibes <time>21:00 [2021/03/03]</time><br/>
                                      Darkest Hour <time>21:00 [2021/03/05]</time>
                </p>
                <br/><br/>
                <h6 style={{ fontSize: "1.5vmax" }}>Contacts</h6><hr/>
                <p id="overlay-description"><br/>Darkest Hour Radio is an open source project and the whole code is at github: <a href="https://github.com/Similiukas/Darkest-Hour-Radio" target="_blank" rel="noopener noreferrer" style={{fontSize: ".8vmax"}}>Similiukas</a>
                    <br/>If you love a song, then press on the <heart style={{ color: "pink" }}>&hearts;</heart> to show the love!
                    <br/>Chat is completely anonymous and unmoderated. It's a wild west internet like it used to be before. So feel free to express your opinion and talk with other listeners.
                    <br/>If you want to contact the developer team (for song suggestions or if <strong>YOU</strong> want to host a live show on the radio) contact via
                    eMail: lesiimass0@gmail.com</p>
            </div>
        </div>
    )
}

export default Info
