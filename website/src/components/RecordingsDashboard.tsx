import { OverlayType, PastRecordData } from 'types';

type Props = {
    toggleOverlay: (overlayType: OverlayType) => void,
    pastRecordData: PastRecordData | null,
    stopCloud: () => void
}

const RecordingsDashboard = ({ toggleOverlay, pastRecordData, stopCloud }: Props) => (
    <div id="recordings-dashboard">
        <div id="recordings-info">
            { !pastRecordData
                ? 'Missed passed show? No worries, now you can listen to previous live shows'
                : 'If you want to go back to the live radio just press this button'}
        </div>
        {/* for the role tag: https://stackoverflow.com/a/54274507 */}
        {/* for the tabindex tag: https://stackoverflow.com/a/58980034 */}
        { !pastRecordData &&
            <span role="button" tabIndex={0} id="recordings-button" onClick={() => toggleOverlay(OverlayType.Podcast)}>past recordings</span>}
        { pastRecordData &&
            <span role="button" tabIndex={0} id="recordings-button" onClick={stopCloud}>back to live</span>}
    </div>
);

export default RecordingsDashboard;
