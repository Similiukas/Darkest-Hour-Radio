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
        tabIndex={0}
        onClick={somethingLikeOnClick}
        style={{ height: buttonHeight, width: buttonWidth }}
    >
        <span className="material-icons">{buttonName}</span>
    </div>
);

export default Button;
