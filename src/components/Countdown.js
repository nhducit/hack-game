import React from 'react';
import moment from 'moment';
import './Countdown.css';

class Countdown extends React.Component {
    constructor(props) {
      super(props)
    }

    state = {
        input: undefined,
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined
    };

    componentDidMount() {
      this.interval = setInterval(() => {
          // const secondTime = this.props.seconds;
          const then = this.props.then;

          // var then;
          // if (state.input === undefined) {
          //   then = moment().add(secondTime, "seconds")
          // } else {
          //   then = state.input
          // }
          // const then = moment().add(secondTime, "seconds")
          const now = moment().subtract(2, "seconds");

          const nowCompare = now.clone().add(1, "seconds")
          if (nowCompare.isAfter(then)) {
            console.log("gogogo");
            if (this.interval) {
                this.props.timeOver();
                clearInterval(this.interval);
            }
          }

          const countdown = moment(then - now);

          const days = countdown.format('D');
          const hours = countdown.format('HH');
          const minutes = countdown.format('mm');
          const seconds = countdown.format('ss');

          console.log("componentDidMount");
          // const secondTime = this.props.seconds;
          // const minutes = secondTime / 60;
          // const seconds = secondTime % 60;

          this.now = moment();
          this.setState({ then, days, hours, minutes, seconds });
      }, 1000);
    }

    componentWillUnmount() {
      console.log("componentWillUnmount");
      if (this.interval) {
          clearInterval(this.interval);
      }
    }

    render() {
        const level = this.props.level;
        const { days, hours, minutes, seconds } = this.state;

        console.log("render");

        // Mapping the date values to radius values
        const daysRadius = mapNumber(days, 30, 0, 0, 360);
        const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
        const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
        const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);

        if (!seconds) {
            return null;
        }

        return (
            <div>
                <div>
                    {minutes && (
                        <div className="L1-0032">
                            L{level} {minutes}:{seconds}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

// From StackOverflow: https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
function mapNumber(number, in_min, in_max, out_min, out_max) {
    return (
        ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
}

export default Countdown;
