import React, { PropTypes } from 'react';


const EditorSidebar = ({
    choices,
    setActive,
    active
}) => 
<div>
    {
        choices.map((choice, index) => 
            <div className={"sidebar-choice" + (choice === active ? ' active' : '')} onClick={() => setActive(choice)} key={index}>
                {choice}
            </div>
        )
    }
</div>

export default EditorSidebar;