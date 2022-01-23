type Props = {
    buttonType: string,
    buttonName: string,
    somethingLikeOnClick: () => void,
    buttonHeight: number,
    buttonWidth: number,
}

const Button = ({ buttonType, buttonName, somethingLikeOnClick, buttonHeight, buttonWidth }: Props) => (
    <div
        className={`button ${buttonType}`}
        role="button"
        tabIndex={-1}
        // Better than onClick since the button goes down as it's clicked https://www.w3schools.com/jsref/event_onmousedown.asp
        onMouseDown={somethingLikeOnClick}
        style={{ height: buttonHeight, width: buttonWidth }}
    >
        <span className="material-icons">{buttonName}</span>
    </div>
);

export default Button;
