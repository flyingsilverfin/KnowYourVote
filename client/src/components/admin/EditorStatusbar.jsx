import React, { PropTypes } from 'react';

const EditorStatusbar = ({
    status,
    modified,
    revertData,
    publishData
}) => 
<div className="flex-column">
    <div 
        className="flex-one statusbar-status center-horizontal">
        {status}
    </div>
    <div className="flex-one flex-row">
        <div 
            className="statusbar-revert center-horizontal" 
            onClick={modified ? revertData : null}>
            Delete
        </div>
        <div 
            className="statusbar-publish center-horizontal" 
            onClick={modified ? publishData : null}>
            Publish
        </div>
    </div>
</div>

export default EditorStatusbar;