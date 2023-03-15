import Moment from "moment";

const TimeAgo = (duration: Moment.Duration) => {
  let timeAgo = '';

  const timeUnits = {
    day: {
      singular: 'den',
      pluralFew: 'dny',
      pluralMany: 'dnů'
    },
    hour: {
      singular: 'hod'
    },
    minute: {
      singular: 'min'
    }
  };

  if (duration.asDays() > 1) {
    const days = Math.floor(duration.asDays());
    const unit = days === 1 ? 'singular' : (days < 5 ? 'pluralFew' : 'pluralMany');
    timeAgo = `${days} ${timeUnits.day[unit]}`;
  } else if (duration.asHours() > 1) {
    timeAgo = Math.floor(duration.asHours()).toString() + " " + timeUnits.hour["singular"];
  } else {
    timeAgo = Math.floor(duration.asMinutes()).toString() + " " + timeUnits.minute["singular"];
  }

  return timeAgo;
}

export default TimeAgo;