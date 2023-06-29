type OverlayType = 'Empty' | 'TimeoutStart' | 'TimeoutEnd' | 'Podcast' | 'Info'

interface PastRecordData {
    name: string,
    listeners: string,
}

type StartCloudRecoding = (showName: string, id: string, listeners: string) => Promise<void>

interface PodcastRecording {
    'creation-date': import('firebase/firestore').Timestamp
    length: number,
    listeners: number,
    name: string
}

interface Podcast {
    name: string,
    recordings: PodcastRecording[]
}

interface ScheduleInfo {
    name: string,
    priority: number,
    date: import('firebase/firestore').Timestamp,
}

type SoundEffectType = 'ButtonClick' | 'CassetteInsert'
