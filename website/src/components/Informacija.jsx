import logoImage from "../images/logo-min.png";

const Informacija = () => {
    return (
        <div id="informacija">
            <img src={logoImage} alt="DHR logo" />
            <p>
                <strong style={{ fontSize: "larger" }}>Darkest Hour Radio</strong><br/>
                <sup style={{ fontSize: "small" }}>We pirate for your entertainment</sup><br/><br/>

                        Next live show schedule:<br/>
                <strong>Darkest Hour<br/>
                <time style={{fontSize: "smaller"}}>21:00 [2021/03/05]</time></strong>
            </p>
        </div> /*<!-- Hide on desktop -->*/
    )
}

export default Informacija
