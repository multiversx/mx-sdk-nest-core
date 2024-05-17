import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

export class StartAppsCommand {
  static async execute(apps: string[]): Promise<void> {
    const tmuxSessionName = 'nestjs-apps';

    try {
      await execPromise('tmux -V');
      console.log('tmux is installed.');

      await execPromise(`tmux new-session -d -s ${tmuxSessionName}`);
      console.log(`Created new tmux session: ${tmuxSessionName}`);

      for (const app of apps) {
        console.log(`Starting ${app} app...`);
        await execPromise(`tmux new-window -t ${tmuxSessionName} -n ${app} "npm run start:${app}"`);
      }

      await execPromise(`tmux attach-session -t ${tmuxSessionName}`);
    } catch (error) {
      console.error('Failed to start applications:', error);
      process.exit(1);
    }
  }
}
