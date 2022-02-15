import * as inquirer from "inquirer";
import { Chain } from "./app";

const chain = new Chain();
const root = chain.add({ data: "_", ref: null });
let branch = "master";

chain.setPointer(branch, root.id);

function ask() {
  inquirer
    .prompt([{ type: "input", name: "line", message: "> " }])
    .then(({ line }: { line: string }) => {
      const command = line.split(/ +/, 1)[0].toLowerCase();
      const rest = line.substring(command.length).trim();

      switch(command) {
        case "log":
          const ptr = chain.getPointer(branch);
          if (!ptr) console.log("<EMPTY>");
          else console.log(JSON.stringify(chain, null, 2));
          break;

        case "clear":
          console.clear();
          break;

        case "exit":
          return;
      }

      ask();
    });
}

ask();
