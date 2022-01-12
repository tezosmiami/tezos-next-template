import { useState, useEffect } from 'react';

export const LightButton = () => {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
      const localLight = window.localStorage.getItem('lightMode');
      if(localLight === 'true') setLightMode(true);
  }, [])
 
  function handleLightToggle() {
      if(!lightMode) {
          document.body.classList.add('lightMode');
          window?.localStorage.setItem('lightMode', "true");
      } else {
          document.body.classList.remove('lightMode');
          window?.localStorage.setItem('lightMode', 'false');
      }
      setLightMode(!lightMode);
  }
  return(
  <div>
            <button
                onClick={handleLightToggle}
                id={'lightButton'}
                title={'Toggle Light mode'}
            >{lightMode ? '✧' : '✦'}</button>
      </div>
  )
}