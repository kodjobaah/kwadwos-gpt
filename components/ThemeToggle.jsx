'use client';

import {BsMoonFill, BsSunFill} from 'react-icons/bs';
import { useState} from 'react';

const themes = {
    aqua: 'aqua',
    luxury: 'luxury',
};

const ThemeToggle = () => {
    const [theme, setTheme] = useState(themes.aqua)

    const toggleTheme = () => {
        const newTheme = theme === themes.aqua? themes.luxury: themes.aqua;
        document.documentElement.setAttribute('data-theme', newTheme)
        setTheme(newTheme);

    }
  return (
   <button onClick={toggleTheme} className='btn btn-sm btn-outline'>
    {theme === 'aqua' ? <BsMoonFill className='h-4 w-4'/>: <BsSunFill className='h-4 w-4' />}</button>
  )
}

export default ThemeToggle