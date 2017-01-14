
import xs, {Stream} from 'xstream';

const parseIntIfDecimal = (str) => {
  if (str.match(/[0-9]/)) {
    return parseInt(str, 10);
  }

  return str;
}

function makeDiagram (scheduleEntry, currentTime, interval) {
  return function diagram (diagram: string, values = {}): Stream<any> {
    const characters = diagram.split('');
    const stream = xs.create();
    const valueFor = (character) => values[character] || parseIntIfDecimal(character);

    characters.forEach((character, index) => {
      if (character === '-') {
        return;
      }

      const timeToSchedule = index * interval;

      if (character === '|') {
        scheduleEntry({
          time: timeToSchedule,
          stream,
          type: 'complete'
        })
      } else if (character === '#') {
        scheduleEntry({
          time: timeToSchedule,
          stream,
          type: 'error',
          error: new Error(`scheduled error`)
        })
      } else {
        scheduleEntry({
          time: timeToSchedule,
          stream,
          type: 'next',
          value: valueFor(character)
        })
      }
    });

    return stream;
  }
}

export {
  makeDiagram
}