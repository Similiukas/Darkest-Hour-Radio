const Button = ({ buttonType, buttonName, somethingLikeOnClick, buttonHeight, buttonWidth }) => {

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
