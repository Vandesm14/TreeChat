// import { Graph, Node, GraphView } from './src/graph';
// import { v4 } from 'uuid';

// const graph = new Graph<string, string>();

// const root = v4();
// const msg1 = v4();
// const msg2 = v4();
// const msg3 = v4();

// console.log('INSERT:', graph.insert(root, new Node('ROOT')));
// console.log('INSERT:', graph.insert(msg1, new Node('hi shane!', root)));
// console.log('INSERT:', graph.insert(msg2, new Node("hey, what's up?", msg1)));
// console.log('CREATE:', graph.create(msg3, new Node('whoop whoop', msg1)));

// console.log('CREATE:', graph.create(msg1, new Node('hi shane!', root)));

// console.log('HAS:', graph.has(msg1));
// console.log('GET:', graph.get(msg1));

// // console.log(graph.nodes());

// const view = new GraphView(graph);

// console.log('PARENT:', view.parent(msg3));

// for (const node of view.from(msg3)) {
//   console.log('NODE:', node);
// }

// // import * as inquirer from 'inquirer';
// // import { Client } from './src/client';

// // const client = new Client();

// // function cks(str: string, cks: string[]) {
// //   return cks.find((c) => c === str) !== undefined;
// // }

// // function commands(
// //   line: string,
// //   commands: [string[], (args: string[]) => void][]
// // ) {
// //   const args = line.split(/ +/);
// //   const command = args.shift()?.toLowerCase();

// //   if (command) {
// //     for (const [coms, fn] of commands) {
// //       if (cks(command, coms)) {
// //         fn(args);
// //         break;
// //       }
// //     }
// //   } else {
// //     console.error(`ERROR: invalid command`);
// //   }
// // }

// // function channel(args: string[]) {
// //   const option = args.shift()?.toLowerCase();

// //   if (option) {
// //     if (cks(option, ['new', 'n'])) {
// //       const channelName = checkChannel(args);
// //       if (!channelName) return;

// //       try {
// //         client.newChannel(channelName);
// //         console.log(`Created channel: "${channelName}"`);
// //       } catch {
// //         console.error(
// //           `ERROR: a channel with name "${channelName}" already exists`
// //         );
// //       }
// //     } else if (cks(option, ['list', 'l'])) {
// //       console.log(`Current channel: "${client.channel}"`);
// //     } else if (cks(option, ['switch', 's'])) {
// //       const channelName = checkChannel(args);
// //       if (!channelName) return;

// //       try {
// //         client.newChannel(channelName);
// //         console.error(`ERROR: no channel with name "${channelName}" exists`);
// //       } catch {
// //         client.channel = channelName;
// //         console.log(`Switched to channel: "${channelName}"`);
// //       }
// //     }
// //   } // else {}
// // }

// // function checkChannel(args: string[]): string | undefined {
// //   const name = args.shift();

// //   if (name === undefined) {
// //     console.error(`ERROR: no channel name provided`);
// //   } else if (args.shift() !== undefined) {
// //     console.error(
// //       `ERROR: a channel name cannot have a space (" ") in the name`
// //     );
// //   } else {
// //     return name;
// //   }

// //   return;
// // }

// // function ask() {
// //   inquirer
// //     .prompt([{ type: 'input', name: 'line', message: '> ' }])
// //     .then(({ line }: { line: string }) => {
// //       commands(line, [
// //         [['exit'], () => process.exit(0)],
// //         [['clear'], console.clear],
// //         [['channel', 'c'], channel],
// //         // [["message", "m"], () => {}],
// //         // [["reply", "r"], () => {}],
// //       ]);
// //       ask();
// //     });
// // }
// // ask();
