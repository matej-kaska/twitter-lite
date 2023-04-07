import Moment from "moment";

const TimeAgo = (duration: Moment.Duration) => {
  let timeAgo = '';

  const timeUnits = {
    day: {
      singular: 'day',
      pluralMany: 'days'
    },
    hour: {
      singular: 'hour',
      pluralMany: 'hours'
    },
    minute: {
      singular: 'min',
      pluralMany: 'mins'
    }
  };

  if (duration.asDays() > 1) {
    const days = Math.floor(duration.asDays());
    const unit = days > 1 ? 'pluralMany' : 'singular';
    timeAgo = `${days} ${timeUnits.day[unit]}`;
  } else if (duration.asHours() > 1) {
    const hours = Math.floor(duration.asHours());
    const unit = hours > 1 ? 'pluralMany' : 'singular';
    timeAgo = `${hours} ${timeUnits.hour[unit]}`;
  } else {
    const mins = Math.floor(duration.asMinutes());
    const unit = mins > 1 ? 'pluralMany' : 'singular';
    timeAgo = `${mins} ${timeUnits.minute[unit]}`;
  }

  return timeAgo;
}

export default TimeAgo;