type Props = {
    toggleOverlay: (_: string) => void,
    pastRecordData: any,
    stopCloud: () => void
}

const RecordingsDashboard: React.FC<Props> = ({ toggleOverlay, pastRecordData, stopCloud }) => {
    return (
        <div id="recordings-dashboard">
            <div id="recordings-info">
                { !pastRecordData ?
                    "Missed passed show? No worries, now you can listen to previous live shows":
                    "If you want to go back to the live radio just press this button"
                }
            </div>
            { !pastRecordData &&
                <span id="recordings-button" onClick={() => toggleOverlay("podcast")}>past recordings</span>
            }
            { pastRecordData &&
                <span id="recordings-button" onClick={stopCloud}>back to live</span>
            }
        </div>
    )
}

export default RecordingsDashboard
