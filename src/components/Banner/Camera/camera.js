import React, { Component } from 'react';
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

class App extends React.Component {
  static onTakePhoto(dataUri) {
    // Do stuff with the photo...
    console.log('ontakePhoto');
  }

  static onCameraError(error) {
    console.error('onCameraError', error);
  }

  static onCameraStart(stream) {
    console.log('onCameraStart');
  }

  static onCameraStop() {
    console.log('onCameraStop');
  }

  render() {
    return (
      <div className="App">
        <Camera
          onTakePhoto = { (dataUri) => { this.onTakePhoto(dataUri); } }
          onCameraError = { (error) => { this.onCameraError(error); } }
          idealFacingMode = {FACING_MODES.ENVIRONMENT}
          idealResolution = {{ width: 600, height: 440 }}
          imageType = {IMAGE_TYPES.JPG}
          imageCompression = {0.97}
          isMaxResolution = {false}
          isImageMirror = {false}
          isDisplayStartCameraError = {true}
          sizeFactor = {1}
          onCameraStart = { (stream) => { this.onCameraStart(stream); } }
          onCameraStop = { () => { this.onCameraStop(); } }
        />
      </div>
    );
  }
}

export default App;
