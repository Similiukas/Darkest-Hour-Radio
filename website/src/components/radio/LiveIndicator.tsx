import pixels from 'pixels.json';

type Props = {
    templateRatio: number,
    areWeLive: boolean,
}

const LiveIndicator = ({ templateRatio, areWeLive }: Props) => {
    const size = templateRatio * pixels.LiveIndicator.size;

    const marginLeft = templateRatio * pixels.LiveIndicator.marginLeft;
    const marginTop = templateRatio * pixels.LiveIndicator.marginTop;

    // TODO: Need to check the placing of the inside of the blink. For some reason not perfectly in the middle?
    return (
        <div
            id="live-indicator"
            style={{
                width: size,
                height: size,
                marginLeft,
                marginTop,
            }}
        >
            <div className={`live-indicator-blink ${areWeLive ? 'on' : ''}`} />
        </div>
    );
};

export default LiveIndicator;
