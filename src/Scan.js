import React, {Component} from 'react';
import { ToastContainer, toast } from 'react-toastify';
import {isIOS} from 'react-device-detect';
import 'react-toastify/dist/ReactToastify.css';

const ScanConstant = {
    MAX_DIFF_TIME_WITH_SCAN_BARCODE: 100
}

class ScanComponent extends Component {
    static className = 'ScanComponent';
    scanString = "";
    lastCharacter = "";
    currentStringLength = 0;
    lastScanTimeStamp = Date.now();
    removeScanStringKeys = ['backspace', 'delete'];
    nonScanKeys = ['control'];
    shiftMapKeys = {
        "1": "!",
        "2": "@",
        "3": "#",
        "4": "$",
        "5": "%",
        "6": "^",
        "7": "&",
        "8": "*",
        "9": "(",
        "0": ")",
        "-": "_",
        "=": "+",
        "[": "{",
        "]": "}",
        ";": ":",
        "'": '"',
        ",": '<',
        ".": '>',
        "/": '?',
        "`": '~'
    };

    componentWillMount() {
        document.addEventListener('keyup', event => this.scanBarcode(event));
    }
    
    componentWillUnmount() {
        document.removeEventListener('keyup');
    }

    scanBarcode(event) {
        // if (!this.props.currentScanPage) {
        //     return this;
        // }
        let key = event.key;
        if (isIOS) {
            key = event.code;
            key = key.replace(/Left|Right|Key|Digit/gi, '');
        }

        if (!key) {
            return this;
        }
        key = key.toString();
        let lowerCaseKey = key.toLowerCase();
        if (this.nonScanKeys.includes[lowerCaseKey]) {
            return this;
        }
        if (lowerCaseKey === 'shift') {
            this.lastCharacter = lowerCaseKey;
            if (!this.currentStringLength) {
                this.lastScanTimeStamp = Date.now();
            }
            this.currentStringLength++;
            return this;
        }
        let currentTime = Date.now();
        let diffTime = currentTime - this.lastScanTimeStamp;
        this.currentStringLength++;
        toast(key);

        if (this.removeScanStringKeys.includes(lowerCaseKey)) {
            this.resetScanString();
            return this;
        }
        if (diffTime / this.currentStringLength < ScanConstant.MAX_DIFF_TIME_WITH_SCAN_BARCODE) {
            if (lowerCaseKey === 'enter' && this.scanString) {
                alert(this.scanString);
                this.resetScanString();
            } else {
                if (lowerCaseKey === 'enter') {
                    this.resetScanString();
                } else {
                    if (this.lastCharacter === 'shift') {
                        if (key.length === 1) {
                            if (this.shiftMapKeys[key]) {
                                key = this.shiftMapKeys[key];
                            } else {
                                key = key.toUpperCase();
                            }
                        } else {
                            this.lastCharacter = lowerCaseKey;
                            return this;
                        }
                    }
                    this.lastCharacter = lowerCaseKey;
                    this.scanString = this.scanString + key;
                }
            }
        } else {
            this.lastScanTimeStamp = Date.now();
            if (lowerCaseKey === 'enter') {
                this.resetScanString();
            } else {
                if (this.lastCharacter === 'shift') {
                    this.currentStringLength = 1;
                    key = key.toUpperCase();
                }
                this.currentStringLength = 1;
                this.scanString = key;
            }
            this.lastCharacter = lowerCaseKey;
        }
    }

    resetScanString() {
        this.scanString = "";
        this.lastCharacter = "";
        this.currentStringLength = 0;
        this.lastScanTimeStamp = Date.now();
    }

    render() {
        return <span>
            Scanner
             <ToastContainer />
        </span>
    }
}

export default ScanComponent