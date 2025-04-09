import React, { useState } from 'react';
import { Button } from '@mui/material';

function ButtonGrad({ children, ...props }) {
    const [hover, setHover] = useState(false);
    return (
        <Button
            {...props} // Spread any props like onClick, type, etc.
            style={{
                background: hover
                    ? 'linear-gradient(117deg, rgba(236,178,66,1) 39%, rgba(238,134,18,1) 96%)'
                    : 'linear-gradient(117deg, rgba(238,134,18,1) 39%, rgba(236,178,66,1) 96%)',
                border: 'none',
                padding: '10px 20px',
                fontSize: '16px',
                color: 'white',
                width: '100%',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'background 0.3s ease',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {children}
        </Button>
    );
}

export default ButtonGrad;
