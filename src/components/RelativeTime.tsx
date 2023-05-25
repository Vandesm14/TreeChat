import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

function RelativeTime({ date }: { date: Date }) {
  return (
    <Tooltip2
      content={dayjs(date).format('MMMM D, YYYY h:mm A')}
      placement="bottom"
    >
      <Popover2 content={dayjs(date).fromNow()} placement="bottom">
        <span>{dayjs(date).format('h:mm A')}</span>
      </Popover2>
    </Tooltip2>
  );
}

export default RelativeTime;
