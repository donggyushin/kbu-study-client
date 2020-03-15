import React, { useRef, useEffect } from 'react'

interface IProps {
    exitTimeString: string
    handleExitTimeString: (event: React.ChangeEvent<HTMLInputElement>) => void
    turnOfExitTimeInput: () => void
}

function useOutsideAlerter(ref: any, turnOfExitTimeInput: () => void) {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            turnOfExitTimeInput()
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
}


const ExitTimeInput: React.FC<IProps> = ({
    exitTimeString,
    handleExitTimeString,
    turnOfExitTimeInput
}) => {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, turnOfExitTimeInput);

    return <div className="exittimeinput_container">
        <div ref={wrapperRef}>
            <input onChange={handleExitTimeString} value={exitTimeString} type="text" />
            <button >변경</button>
        </div>
    </div>
}

export default ExitTimeInput