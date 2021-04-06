const Timeout = ({ onClick }) => {
    return (
        <div className="overlay timeout" onClick={onClick}>
            <h3 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%"}}>
                Are you still listening?
            </h3>
        </div>
    )
}

export default Timeout
