import React, { PropTypes } from 'react';


const Base = ({ children }) => (
  <div className="full-height">
    {children}
  </div>
);

Base.propTypes = {
  children: PropTypes.object.isRequired
};

export default Base;
