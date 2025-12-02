import { useContext } from "react";
import { AppContext } from "../AppContext";

const GameCard = (props) => {
  const { contextData } = useContext(AppContext);

  return (
    <div className={`casino-game game_Universal ${props.mobileShowMore ? 'mobile' : ''}`} onClick={props.onClick} data-game-id={props.id || props.gameId}>
      <div className="casino-game__content">
        <img src={props.imageSrc} loading="lazy" />
        <div className="casino-game__buttons">
          <a className="play_money for_auth">{props.text}</a>
        </div>
      </div>
      <div className="casino-game__provider">
        {
          props.provider && <>
            <img src={props.provider?.image_local ? contextData.cdnUrl + props.provider?.image_local : props.provider?.image_url} loading="lazy" />
            <span>{props.provider?.name || 'Casino'}</span>
          </>
        }
      </div>
      <div className="casino-game__name">{props.title}</div>
    </div>
  );
};

export default GameCard;
