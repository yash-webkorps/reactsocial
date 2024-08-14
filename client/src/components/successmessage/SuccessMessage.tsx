import React from "react";
import { SuccessMessageProps } from "../../interfaces/interfaces";
import './SuccessMessage.css';

const SuccessMessage: React.FC<SuccessMessageProps> = (props) => {
    return (<>
        <div className="success-message">{props.message}</div>
    </>);
}

export default SuccessMessage;