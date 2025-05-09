// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY;
let circleSize = 100;

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Initialize circle position at the center of the canvas
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // Draw the circle
  fill(0, 255, 0, 150);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  // Ensure at least one hand is detected
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Get the positions of the index finger tip (keypoint 8) and thumb tip (keypoint 4)
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // Check if both the index finger and thumb are touching the circle
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleSize / 2 && dThumb < circleSize / 2) {
          // Move the circle to the midpoint between the index finger and thumb
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;
        }

        // Draw the index finger keypoint
        fill(255, 0, 0);
        noStroke();
        circle(indexFinger.x, indexFinger.y, 16);

        // Draw the thumb keypoint
        fill(0, 0, 255);
        noStroke();
        circle(thumb.x, thumb.y, 16);
      }
    }
  }
}
