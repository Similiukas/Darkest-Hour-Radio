import logoImage from "../images/logo-min.png";

const Informacija = ({ secret }) => {
    return (
        <div id="informacija">
            <div id="text">
                Next live show schedule:
                <strong style={{ paddingTop: 10 }}>Darkest Hour</strong>
                <time style={{ fontSize: "smaller", paddingTop: 2 }}>21:00 [2021/03/05]</time>
            </div>
            <div id="logo-container">
                <img src={logoImage} alt="DHR logo" onClick={(e) => { if(e.detail === 3) secret(true) }}/>
            </div>
        </div> /*<!-- Hide on desktop -->*/
    )
}

export default Informacija
