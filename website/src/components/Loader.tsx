const Loader = ({ scale = 0.5 }) => (
    // Original: https://codepen.io/nikhil8krishnan/pen/rVoXJa
    <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', transform: `scale(${scale})` }}>
        <svg
            version="1.1"
            id="L9"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 50 100"
            enableBackground="new 0 0 0 0"
            xmlSpace="preserve"
            height="150px"
        >
            <rect x="0" y="0" width="5" height="50" fill="#fff">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 50; 0 0"
                    begin="0"
                    dur="1.4s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="15" y="0" width="5" height="50" fill="#fff">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 50; 0 0"
                    begin="0.2s"
                    dur="1.4s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="30" y="0" width="5" height="50" fill="#fff">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 50; 0 0"
                    begin="0.4s"
                    dur="1.4s"
                    repeatCount="indefinite"
                />
            </rect>
            <rect x="45" y="0" width="5" height="50" fill="#fff">
                <animateTransform
                    attributeType="xml"
                    attributeName="transform"
                    type="translate"
                    values="0 0; 0 50; 0 0"
                    begin="0.6s"
                    dur="1.4s"
                    repeatCount="indefinite"
                />
            </rect>
        </svg>
    </div>
);

export default Loader;
