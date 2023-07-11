import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import startLocalVideoStream from "./startLocalVideoStream";
import updateCallStatus from "../../redux-elements/actions/updateCallStatus";

const VideoButton = ({smallFeedEl})=>{

    const callStatus = useSelector(state=>state.callStatus)
    const streams = useSelector(state=>state.streams);
    const [ pendingUpdate, setPendingUpdate ] = useState(false);
    const dispatch = useDispatch();

    const startStopVideo = ()=>{
        // console.log("Sanity Check")
        //first, check if the video is enabled, if so disabled
        if(callStatus.video === "enabled"){
            //update redux callStatus
            dispatch(updateCallStatus('video',"disabled"));
            //set the stream to disabled
            const tracks = streams.localStream.stream.getVideoTracks();
            tracks.forEach(t=>t.enabled = false);
        }else if(callStatus.video === "disabled"){
        //second, check if the video is disabled, if so enable
            //update redux callStatus
            dispatch(updateCallStatus('video',"enabled"));
            const tracks = streams.localStream.stream.getVideoTracks();
            tracks.forEach(t=>t.enabled = true);
        }else if(callStatus.haveMedia){
            //thirdly, check to see if we have media, if so, start the stream
            //we have the media! show the feed
            smallFeedEl.current.srcObject = streams.localStream.stream
            //add tracks to the peerConnections
            startLocalVideoStream(streams, dispatch);
        }else{
            //lastly, it is possible, we dont have the media, wait for the media, then start the stream
            setPendingUpdate(true);
        }
    }

    useEffect(()=>{
        if(pendingUpdate && callStatus.haveMedia){
            console.log('Pending update succeeded!')
            //this useEffect will run if pendingUpdate changes to true!
            setPendingUpdate(false) // switch back to false
            smallFeedEl.current.srcObject = streams.localStream.stream
            startLocalVideoStream(streams, dispatch);
        }
    },[pendingUpdate,callStatus.haveMedia])
 
    return(
        <div className="button-wrapper video-button d-inline-block">
            <i className="fa fa-caret-up choose-video"></i>
            <div className="button camera" onClick={startStopVideo}>
                <i className="fa fa-video"></i>
                <div className="btn-text">{callStatus.video === "enabled" ? "Stop" : "Start"} Video</div>
            </div>
        </div>
    )
}
export default VideoButton;