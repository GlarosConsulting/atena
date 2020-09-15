import { spawn } from 'child_process';

export default function _spawn(command: string, args?: string[]): void {
  const child = spawn(command, args);

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', data => {
    console.log(`${data}`);

    data = data.toString();
  });

  child.stderr.on('data', data => {
    console.log(`${data}`);

    data = data.toString();
  });

  child.on('close', code => {
    console.log(`Process exit code ${code}`);
  });
}
