import { useState } from 'react';
import { useDidMount } from '../hooks/EffectExceptFirst';
import { useDelayBool } from "../hooks/DelayBool";
import pixels from '../../pixels.json';
import HUDVisualizer from "./HUDVisualizer";

type Props = {
    templateRatio: number,
    listenerCount: string,
    audioVolumeLevel: number,
    audioPlayer: HTMLAudioElement,
    pastRecordData: any,
}

const HUD = ({ templateRatio, listenerCount, audioVolumeLevel, audioPlayer, pastRecordData }: Props) => {
    const width = templateRatio * pixels.HUD.width - 2 * templateRatio * pixels.HUD.width * pixels.HUD.MARGIN_X;
    const height = templateRatio * pixels.HUD.height - 2 * templateRatio * pixels.HUD.height * pixels.HUD.MARGIN_Y;
    const marginLeft = templateRatio * pixels.HUD.marginLeft + templateRatio * pixels.HUD.width * pixels.HUD.MARGIN_X;
    const marginTop = templateRatio * pixels.HUD.marginTop + templateRatio * pixels.HUD.height * pixels.HUD.MARGIN_Y;
    
    const [listenerText, setListenerText] = useState("Current Listeners:");

    // Adding a delay for animating change of listeners
    const listenerVisible = useDelayBool(500, [listenerCount]);

    useDidMount(() => {
        if(pastRecordData) setListenerText("Total Listeners:");
        else setListenerText("Current Listeners:");
    })

    return (
        <div id="HUD" style={{
            width: width,
            height: height,
            marginLeft: marginLeft,
            marginTop: marginTop
        }}>
            <div id="sound-container">
                <div id="sound-bar">
                    <div    className="sound-inner"
                            style={{
                                height: (1 - audioVolumeLevel) * 100 + "%"
                            }}>
                    </div>
                </div>
                <div id="sound-text">SOUND <br/> LEVEL</div>
                <div id="sound-bar">
                    <div    className="sound-inner"
                            style={{
                                height: (1 - audioVolumeLevel) * 100 + "%"
                            }}>
                    </div>
                </div>
            </div>
            
            <HUDVisualizer audioPlayer={audioPlayer}/>

            <div id="listeners">
                {listenerText}<br/>
                <span id="listener-count-container">
                    <span className={`listener-inner ${listenerVisible ? "visible" : ""}`}>{listenerCount}</span>
                </span>
            </div>
        </div>
    )
}

export default HUD
