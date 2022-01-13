type Props = {
    onClick: () => void,
}

const Timeout = ({ onClick }: Props) => (
    <div className="overlay timeout" role="button" tabIndex={0} onClick={onClick}>
        <h3 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%' }}>
            Are you still listening?
        </h3>
    </div>
);

export default Timeout;
