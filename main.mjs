
/**************************************************************/
// main.mjs
// Main entry for index.html
// Written by Dylan Figliola, Term 2 2025?
/**************************************************************/
const COL_C = 'white';	    // These two const are part of the coloured 	
const COL_B = '#CD7F32';	//  console.log for functions scheme
console.log('%c main.mjs', 
    'color: blue; background-color: white;');

/**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the constants & functions required from fb_io module


import { fb_initialise, fb_login, fb_WriteRec, fb_ReadRec, writeEmail}
    from './script.mjs'; 
    window.fb_initialise   = fb_initialise;
    window.fb_login = fb_login;
    window.fb_WriteRec = fb_WriteRec;
    window.fb_ReadRec = fb_ReadRec;
    window.writeEmail = writeEmail;
    