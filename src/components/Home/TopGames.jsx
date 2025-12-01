import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../../AppContext';

import IconLoading from "/src/assets/img/miniloader.png";

const TopGames = ({ games, text, title, onGameClick }) => {
    const { contextData } = useContext(AppContext);

    return (
        <div className="home-block">
            <div className="home-block__header">
                <div>
                    <div className="home-block__title">{title}</div>
                </div>
                <div><a href="/casino/categories/Popular">Todos</a></div>
            </div>
            <div className="home-block__content">
                <div className="home_casino_list">
                {
                    games.length === 0 ? (
                        <div className="home-block__loader">
                            <img src={IconLoading} />
                        </div>
                    ) :
                    games.slice(0, 16).map((game) => (
                        <div key={game.id} className="casino-game game_Universal">
                            <div className="casino-game__content">
                                <img src={game.image_local != null && game.image_local !== "" ? contextData.cdnUrl + game.image_local : game.image_url} loading="lazy" />
                                <div className="casino-game__buttons">
                                    <a onClick={() => onGameClick && onGameClick(game)} className="play_money">{text}</a>
                                </div>
                            </div>
                            <div className="casino-game__name">{game.name}</div>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default TopGames
