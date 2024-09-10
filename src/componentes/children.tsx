import React, { ReactNode } from 'react'; //Importa el React

const Hecho_en: React.FC<{ children: ReactNode }> = ( { children }) => {
    return <div className='Lugar de origen'>{children}</div>
};

export default Hecho_en;