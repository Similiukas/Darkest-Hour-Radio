type Props = {
    buttonType: string,
    buttonName: string,
    somethingLikeOnClick: () => void,
    buttonHeight: number,
    buttonWidth: number,
}

const Button = ({ buttonType, buttonName, somethingLikeOnClick, buttonHeight, buttonWidth }: Props) => {

    return (
        <div
            className={"button " + buttonType}
            onClick={somethingLikeOnClick}
            style={{height: buttonHeight, width: buttonWidth}
        }>
            <span className="material-icons">{buttonName}</span>
        </div>
    )
}

export default Button
