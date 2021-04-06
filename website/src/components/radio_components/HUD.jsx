import { useState } from 'react';
import { useDidMount } from '../hooks/EffectExceptFirst';
import pixels from '../../pixels.json';
import HUDVisualizer from "./HUDVisualizer";

const HUD = ({ templateRatio, listenerCount, audioVolumeLevel, audioPlayer, pastRecordData }) => {
    const width = templateRatio * pixels.HUD.width - 2 * templateRatio * pixels.HUD.width * pixels.HUD.MARGIN_X;
    const height = templateRatio * pixels.HUD.height - 2 * templateRatio * pixels.HUD.height * pixels.HUD.MARGIN_Y;
    const marginLeft = templateRatio * pixels.HUD.marginLeft + templateRatio * pixels.HUD.width * pixels.HUD.MARGIN_X;
    const marginTop = templateRatio * pixels.HUD.marginTop + templateRatio * pixels.HUD.height * pixels.HUD.MARGIN_Y;
    
    const [listenerText, setListenerText] = useState("Current Listeners:");

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
                <span id="listener-count">{listenerCount}</span>
            </div>
        </div>
    )
}

export default HUD
