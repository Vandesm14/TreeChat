import { Tooltip2 } from '@blueprintjs/popover2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/*
 * Detects navigator locale 24h time preference
 * It works by checking whether hour output contains AM ('1 AM' or '01 h')
 * based on the user's preferred language
 */
const isBrowserLocale24h = () =>
  !new Intl.DateTimeFormat(navigator.language, { hour: 'numeric' })
    .format(0)
    .match(/AM/);

function RelativeTime({ date }: { date: Date }) {
  const is24h = isBrowserLocale24h();
  const fmt24h = 'HH:mm';
  const fmt12h = 'h:mm A';

  const timeFormat = is24h ? fmt24h : fmt12h;

  return (
    <Tooltip2
      content={dayjs(date).format(`MMMM D, YYYY ${timeFormat}`)}
      placement="bottom"
    >
      <span>{dayjs(date).format(timeFormat)}</span>
    </Tooltip2>
  );
}

export default RelativeTime;
