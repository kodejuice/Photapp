import React from 'react';
import {VideoFile, ImageFile} from './index';
import {getUploadedFileURL} from './helper';

/**
 * modal for viewing uploaded files
 *
 * @param      {File}  file
 */
export default function ViewFile({file}) {
    return (
        <React.Fragment>
            <input className="modal-state" id="modal-viewfile" type="checkbox"/>
            <div className="modal view-file">
                <label className="modal-bg" htmlFor="modal-viewfile" onClick={()=>pauseModalVideo()}></label>
                <div className="modal-body view-file-modal">
                    <button id='close' onClick={()=>pauseModalVideo()}> <label htmlFor='modal-viewfile'> X </label> </button>
                    {file && (
                        file.type.includes('video')
                        ? <VideoFile file={file} large={true} />
                        : <ImageFile file={file} />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
} 

function pauseModalVideo() {
    const video: HTMLVideoElement|null = document.querySelector('.modal.view-file video');
    video?.pause();
}
