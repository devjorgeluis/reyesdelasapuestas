import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="footer">
                <div className="wrap_content">
                    <div className="middle_seporator"></div>
                    <div className="footer_content">
                        <div>
                            <a href="/home">Inicio</a>
                            <a href="/casino"><b><u>CASINO</u></b></a>
                            {
                                isSlotsOnly === "false" && <>
                                    <a href="/live-casino">Casino en vivo</a>
                                    <a href="/sports">Deportes</a>
                                    <a href="/live-sports">Deportes en vivo</a>
                                </>
                            }
                        </div>
                        <div>
                            <a href="https://www.facebook.com/reyes.de.las.apuestas.2024" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="23" height="23" x="0" y="0" viewBox="0 0 512 512" xmlSpace="preserve" className="hovered-paths">
                                    <g>
                                        <path d="M437 0H75C33.648 0 0 33.648 0 75v362c0 41.352 33.648 75 75 75h151V331h-60v-90h60v-61c0-49.629 40.371-90 90-90h91v90h-91v61h91l-15 90h-76v181h121c41.352 0 75-33.648 75-75V75c0-41.352-33.648-75-75-75zm0 0" opacity="1" className="hovered-path"></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/losreyes.delasapuestas?igsh=MWJlcW90NmFjaGNzZg==" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0" y="0" viewBox="0 0 60 60" xmlSpace="preserve">
                                    <g transform="matrix(1.1800000000000004,0,0,1.1800000000000004,-5.399999999999999,-5.399999999999999)">
                                        <path d="M30 20.83c-5.06 0-9.17 4.11-9.17 9.17s4.11 9.18 9.17 9.18 9.18-4.12 9.18-9.18-4.12-9.17-9.18-9.17z" opacity="1"></path>
                                        <path d="M43.84 5H16.16C10.01 5 5 10.01 5 16.16v27.68C5 50 10.01 55 16.16 55h27.68C50 55 55 50 55 43.84V16.16C55 10.01 50 5 43.84 5zM30 46.2c-8.93 0-16.2-7.27-16.2-16.2S21.07 13.81 30 13.81 46.2 21.07 46.2 30 38.93 46.2 30 46.2zm16.54-29.45c-1.89 0-3.43-1.53-3.43-3.42s1.54-3.43 3.43-3.43 3.43 1.54 3.43 3.43-1.54 3.42-3.43 3.42z" opacity="1"></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@ReyesdelasapuestasCasino" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 310 310" xmlSpace="preserve" className="hovered-paths">
                                    <g>
                                        <path d="M297.917 64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359 0-61.369 5.776-72.517 19.938C0 79.663 0 100.008 0 128.166v53.669c0 54.551 12.896 82.248 83.386 82.248h143.226c34.216 0 53.176-4.788 65.442-16.527C304.633 235.518 310 215.863 310 181.835v-53.669c0-29.695-.841-50.16-12.083-63.521zm-98.896 97.765-65.038 33.991a9.997 9.997 0 0 1-14.632-8.863v-67.764a10 10 0 0 1 14.609-8.874l65.038 33.772a10 10 0 0 1 .023 17.738z" opacity="1" className="hovered-path"></path>
                                    </g>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="middle_seporator"></div>
                    <div className="footer_company">
                        Derechos reservados | Reyes de las Apuestas
                    </div>
                    <div className="middle_seporator"></div>
                    <div className="footer_copy">
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;