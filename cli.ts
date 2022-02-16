import * as inquirer from "inquirer";
import { Client } from "./client";

const client = new Client();

function cks(str: string, cks: string[]) {
  return cks.find((c) => c === str) !== undefined;
}

function commands(
  line: string,
  commands: [string[], (args: string[]) => void][],
) {
  const args = line.split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command) {
    for (const [coms, fn] of commands) {
      if (cks(command, coms)) {
        fn(args);
        break;
      }
    }
  } else {
    console.error(`ERROR: invalid command`);
  }
}

function channel(args: string[]) {
  const option = args.shift()?.toLowerCase();

  if (option) {
    if (cks(option, ["new", "n"])) {
      const channelName = checkChannel(args);
      if (!channelName) return;

      try {
        client.newChannel(channelName);
        console.log(`Created channel: "${channelName}"`);
      } catch {
        console.error(`ERROR: a channel with name "${channelName}" already exists`);
      }
    } else if (cks(option, ["list", "l"])) {
      console.log(`Current channel: "${client.channel}"`);
    } else if (cks(option, ["switch", "s"])) {
      const channelName = checkChannel(args);
      if (!channelName) return;

      try {
        client.newChannel(channelName);
        console.error(`ERROR: no channel with name "${channelName}" exists`);
      } catch {
        client.channel = channelName;
        console.log(`Switched to channel: "${channelName}"`);
      }
    }
  } // else {}
}

function checkChannel(args: string[]): string | undefined {
  const name = args.shift();

  if (name === undefined) {
    console.error(`ERROR: no channel name provided`);
  } else if (args.shift() !== undefined) {
    console.error(`ERROR: a channel name cannot have a space (" ") in the name`);
  } else {
    return name;
  }

  return;
}

function ask() {
  inquirer
    .prompt([{ type: "input", name: "line", message: "> " }])
    .then(({ line }: { line: string }) => {
      commands(line, [
        [["exit"], () => process.exit(0)],
        [["clear"], console.clear],
        [["channel", "c"], channel],
        // [["message", "m"], () => {}],
        // [["reply", "r"], () => {}],
      ]);
      ask();
    });
}
ask();
