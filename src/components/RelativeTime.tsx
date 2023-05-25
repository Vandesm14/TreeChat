import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function RelativeTime({ date }: { date: Date }) {
  return (
    <Tooltip2
      content={dayjs(date).format('MMMM D, YYYY hh:mm A')}
      placement="bottom"
    >
      <span>{dayjs(date).format('hh:mm A')}</span>
    </Tooltip2>
  );
}

export default RelativeTime;
