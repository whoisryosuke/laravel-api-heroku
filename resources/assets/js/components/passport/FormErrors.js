import React from 'react';

const FormErrors = ({ errors }) => {
    let errorLoop;

    if(errors.length > 0 ) {
        errorLoop = errors.map((error) => error);
    }
    return(
        <div className="alert alert-danger">
            <p><strong>Whoops!</strong> Something went wrong!</p>
            <br />
            <ul>
                <li>
                    {errorLoop ? errorLoop : ''}
                </li>
            </ul>
        </div>
    )
}

export default FormErrors;
