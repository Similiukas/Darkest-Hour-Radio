import logoImage from "images/logo-min.png";

type Props = {
    secret: (a: boolean) => void,
};

const Informacija = ({ secret }: Props) => {
    const date1 = new Date(Date.UTC(2021, 4, 20, 18));
    return (
        <div id="informacija">
            <div id="text">
                Next live show schedule:
                <strong style={{ paddingTop: 10 }}>Evening Vibes</strong>
                <time style={{ fontSize: "smaller", paddingTop: 2 }}>{` ${date1.getHours()}:00 [${date1.getFullYear()}/${date1.getMonth().toString().padStart(2, "0")}/${date1.getDate().toString().padStart(2, "0")}]`}</time>
            </div>
            <div id="logo-container">
                <img src={logoImage} alt="DHR logo" onClick={(e) => { if(e.detail === 3) secret(true) }}/>
            </div>
        </div> /*<!-- Hide on desktop -->*/
    )
}

export default Informacija
