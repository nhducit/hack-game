import React from 'react';
import moment from 'moment';
import Countdown from './Countdown';
import './GameHeader.css';

class GameHeader extends React.Component {

    render() {

      const level = 4
      const then = moment().add(15, "seconds")
      const timeOver = () => {
        console.log("time over")
      }

      return (
        <div className="Header">
          <div>
            <div className="HeaderLeft">
              <img className="Oval" src="https://library.kissclipart.com/20181005/pe/kissclipart-gif-me-preocupas-clipart-sina-weibo-avatar-clip-ar-8505f646feab9d9f.png" alt="avatar"/>
              <div className="ScoreColor">424</div>
            </div>
          </div>
          <Countdown then={then} timeOver={timeOver} level={level} />
        </div>
      );
    }
}

export default GameHeader;
