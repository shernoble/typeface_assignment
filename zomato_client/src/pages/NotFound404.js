import React from 'react';

export function NotFoundPage(){
    const goBack = () => {
        window.history.back();
    };

    return (
        <div>
        <h1>404 Not Found</h1>
        <p>Sorry, the page you are looking for might be in another castle!</p>
        {/* Use the onClick event to trigger the goBack function */}
        <p><button onClick={goBack}>Go Back</button></p>
        </div>
    );
};
