import {forwardRef, Ref} from "react";
import Webcam from "react-webcam";

const CameraFeed = forwardRef((_, webcamRef: Ref<Webcam>) => (
    <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
            facingMode: "environment",
            width: {ideal: 1920, max: 1920},
            height: {ideal: 1080, max: 1080},
        }}
        screenshotQuality={1}
        style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
        }}
    />
));

export default CameraFeed;
