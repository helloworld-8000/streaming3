import express from 'express'
import { spawn } from 'child_process'
import 'dotenv/config';
const server = express()

const streamkey = process.env.streamkey
const video = "streaming3.mp4"
const audio = "https://zstudioltd.my.id/songs/streaming3.mp3";

const ffmpegCommand = [
  'ffmpeg',
  '-stream_loop', '-1',  // Loop video
  '-i', video,
  '-stream_loop', '-1',  // Loop audio
  '-i', audio,
  '-vcodec', 'libx264',
  '-pix_fmt', 'yuvj420p',
  '-maxrate', '2048k',
  '-preset', 'ultrafast',
  '-r', '12',
  '-framerate', '1',
  '-g', '50',
  '-crf', '51',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-ar', '44100',
  '-strict', 'experimental',
  '-video_track_timescale', '100',
  '-b:v', '1500k',
  '-f', 'flv',
  '-map', '0:v:0',  // Map video stream from the first input (video file)
  '-map', '1:a:0',  // Map audio stream from the second input (audio URL)
  `rtmp://a.rtmp.youtube.com/live2/${streamkey}`,
];

const child = spawn(ffmpegCommand[0], ffmpegCommand.slice(1));

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

child.on('error', (err) => {
  console.error(`Child process error: ${err}`);
});

server.use('/', (req, res) => {
  res.send('Your Live Streaming Is All Ready Live')
})

server.listen(3000, () => {
  console.log('live stream is ready')
})
