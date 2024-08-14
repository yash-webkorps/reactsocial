import React from "react";
import { ErrorMessageProps } from "../../interfaces/interfaces";
import './ErrorMessage.css';

const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
    return (<>
        <div className="error-message">{props.message}</div>
    </>);
}

export default ErrorMessage;