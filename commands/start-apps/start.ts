import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

export class StartAppsCommand {
  static async execute(apps: string[]): Promise<void> {
    const tmuxSessionName = 'nestjs-apps';

    try {
      await execPromise('tmux -V');
      try {
        await execPromise(`tmux has-session -t ${tmuxSessionName}`);
        console.log(`Session ${tmuxSessionName} already exists. Reusing the session.`);
      } catch (error) {
        if ((error as any).code === 1) {
          await execPromise(`tmux new-session -d -s ${tmuxSessionName}`);
          console.log(`Created new tmux session: ${tmuxSessionName}`);
        } else {
          throw error;
        }
      }

      let windowsCreated = 0;

      for (const app of apps) {
        console.log(`Starting ${app} app...`);
        await execPromise(`tmux new-window -t ${tmuxSessionName} -n ${app} "npm run start:${app}"`);
        console.log(`Started ${app} app in a new tmux window.`);
        windowsCreated++;
      }

      console.log(`Total applications started: ${windowsCreated}`);

      const { stdout: tmuxListWindows } = await execPromise(`tmux list-windows -t ${tmuxSessionName}`);
      console.log('tmux windows:\n', tmuxListWindows);

      console.log(`To attach to the tmux session, run: tmux attach-session -t ${tmuxSessionName}`);
    } catch (error) {
      const err = error as Error;
      console.error('Failed to start applications:', err.message);
      process.exit(1);
    }
  }
}
