import { Timestamp } from 'firebase/firestore';

export interface PastRecordData {
    name: string,
    listeners: string,
}

export enum OverlayType {
    Empty,
    TimeoutStart,
    TimeoutEnd,
    Podcast,
    Info,
}

export type StartCloudRecoding = (showName: string, id: string, name: string, listeners: string) => Promise<void>

export interface PodcastRecording {
    id: string,
    'creation-date': Timestamp,
    length: number,
    listeners: number,
    name: string
}

export interface Podcast {
    name: string,
    recordings: PodcastRecording[]
}
