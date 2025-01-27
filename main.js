import express from 'express'
import { spawn } from 'child_process'
import 'dotenv/config';
const server = express()

const streamkey = process.env.streamkey
const video = "streaming.mp4"
const audio = "streaming.mp3";

const ffmpegCommand = [
  'ffmpeg',
  '-stream_loop', '-1',  // Loop video
  '-re',
  '-i', video,            // Ganti dengan path video Anda
  '-stream_loop', '-1',   // Loop audio
  '-re',
  '-i', audio,            // Ganti dengan path audio Anda
  '-vcodec', 'libx264',
  '-pix_fmt', 'yuv420p',   // Gunakan pix_fmt 'yuv420p' untuk kompatibilitas lebih baik
  '-maxrate', '3500k',     // Turunkan bitrate maksimum video (contoh: 3500 kbps)
  '-bufsize', '3500k',     // Sesuaikan buffer size agar lebih stabil
  '-preset', 'veryfast',   // Gunakan preset 'veryfast' untuk streaming
  '-r', '30',              // Tingkatkan framerate menjadi 30fps
  '-g', '60',              // Group of Pictures (GOP) = 2x framerate
  '-crf', '23',            // Kurangi CRF untuk kualitas lebih baik
  '-c:a', 'aac',
  '-b:a', '192k',          // Bitrate audio lebih tinggi
  '-ar', '44100',
  '-strict', 'experimental',
  '-f', 'flv',
  '-map', '0:v:0',         // Map video stream dari input pertama (video file)
  '-map', '1:a:0',         // Map audio stream dari input kedua (audio file)
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
